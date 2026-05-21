import pool from '@/lib/db';
import { createInsForgeServerClient } from '@/lib/insforge-sdk';
import { TenantContext } from './core/tenant';
import { ServiceResult, createSuccess, createError } from './core/types';

export interface DashboardStats {
  totalMembers: number;
  monthlyDonations: number;
  activeProgramsCount: number;
  pendingApprovalsCount: number;
  activeVolunteersCount: number;
  avgWeeklyAttendance: number;
  nextEvent: {
    id: string;
    title: string;
    capacity: number | null;
    start_time: string;
  } | null;
  eventCapacityLabel: string;
}

export interface EngagementTrend {
  label: string;
  height: number;
  value: string;
}

export interface CategoryBreakdown {
  name: string;
  value: number;
}

export interface TrendPoint {
  x: number;
  y: number;
  amount: number;
  time: string;
}

export interface DetailedAnalytics {
  totalVolume: number;
  totalPayments: number;
  totalMembers: number;
  upcomingEvents: number;
  categories: CategoryBreakdown[];
  trendPoints: TrendPoint[];
  polylinePoints: string;
}

export class AnalyticsService {
  private sdk;

  constructor(private context: TenantContext, accessToken?: string) {
    this.sdk = createInsForgeServerClient(accessToken, context.organizationId);
  }

  /**
   * Aggregates key performance indicators for the organization dashboard.
   */
  async getDashboardSummary(): Promise<ServiceResult<DashboardStats>> {
    console.log(`[AnalyticsService.getDashboardSummary] Trace: org=${this.context.organizationId}`);
    
    try {
      // 1. Try SDK (Mixed results/RPC would be better for complex aggregations, but for now we query tables)
      const [membersCount, donationsSum, nextEventRes, volunteersCount] = await Promise.all([
        this.sdk.database.from('users').select('*', { count: 'exact', head: true }).eq('organization_id', this.context.organizationId),
        this.sdk.database.from('donations').select('amount, created_at').eq('organization_id', this.context.organizationId).eq('status', 'successful'),
        this.sdk.database.from('events').select('id, title, capacity, start_time').eq('organization_id', this.context.organizationId).gt('start_time', new Date().toISOString()).order('start_time', { ascending: true }).limit(1).single(),
        this.sdk.database.from('volunteer_shifts').select('user_id', { count: 'exact', head: true }).eq('organization_id', this.context.organizationId)
      ]);

      if (membersCount.error || donationsSum.error || volunteersCount.error) throw new Error('SDK Aggregation failed');

      const nextEvent = nextEventRes.data || null;
      let eventCapacityLabel = 'No capacity set';
      
      if (nextEvent?.capacity) {
        const { count } = await this.sdk.database
          .from('event_registrations')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', nextEvent.id)
          .eq('organization_id', this.context.organizationId);
        
        const rsvpCount = count || 0;
        const percentage = Math.round((rsvpCount / nextEvent.capacity) * 100);
        eventCapacityLabel = `${percentage}% filled (${rsvpCount}/${nextEvent.capacity})`;
      }

      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const monthlyDonations = ((donationsSum.data as any[]) || [])
        .filter((d: { created_at: string }) => {
          const date = new Date(d.created_at);
          return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        })
        .reduce((sum: number, d: { amount: number }) => sum + Number(d.amount), 0);

      return createSuccess({
        totalMembers: membersCount.count || 0,
        monthlyDonations,
        activeProgramsCount: 8,
        pendingApprovalsCount: 12,
        activeVolunteersCount: volunteersCount.count || 0,
        avgWeeklyAttendance: 850,
        nextEvent,
        eventCapacityLabel
      });
    } catch (err) {
      // 2. Hybrid Fallback
      try {
        const [membersRes, donationsRes, eventRes, volunteerRes] = await Promise.all([
          pool.query('SELECT COUNT(*) as count FROM users WHERE organization_id = $1', [this.context.organizationId]),
          pool.query(`
            SELECT COALESCE(SUM(amount), 0) as total 
            FROM donations 
            WHERE organization_id = $1 AND status = 'successful' 
            AND extract(month from created_at) = extract(month from current_date)
            AND extract(year from created_at) = extract(year from current_date)
          `, [this.context.organizationId]),
          pool.query(`
            SELECT id, title, capacity, start_time 
            FROM events 
            WHERE organization_id = $1 AND start_time > NOW() 
            ORDER BY start_time ASC LIMIT 1
          `, [this.context.organizationId]),
          pool.query(
            'SELECT COUNT(DISTINCT user_id) as count FROM volunteer_shifts WHERE organization_id = $1', 
            [this.context.organizationId]
          )
        ]);

        const nextEvent = eventRes.rows[0] || null;
        let eventCapacityLabel = 'No capacity set';
        
        if (nextEvent?.capacity) {
          try {
            const rsvpRes = await pool.query(
              'SELECT COUNT(*) as count FROM event_registrations WHERE event_id = $1 AND organization_id = $2',
              [nextEvent.id, this.context.organizationId]
            );
            const rsvpCount = parseInt(rsvpRes.rows[0]?.count || '0', 10);
            const percentage = Math.round((rsvpCount / nextEvent.capacity) * 100);
            eventCapacityLabel = `${percentage}% filled (${rsvpCount}/${nextEvent.capacity})`;
          } catch {
            eventCapacityLabel = `Capacity: ${nextEvent.capacity}`;
          }
        }

        return createSuccess({
          totalMembers: parseInt(membersRes.rows[0]?.count || '0', 10),
          monthlyDonations: parseFloat(donationsRes.rows[0]?.total || '0'),
          activeProgramsCount: 8,
          pendingApprovalsCount: 12,
          activeVolunteersCount: parseInt(volunteerRes.rows[0]?.count || '0', 10),
          avgWeeklyAttendance: 850,
          nextEvent,
          eventCapacityLabel
        });
      } catch (poolError) {
        console.error('[AnalyticsService.getDashboardSummary] Critical Pool Error:', poolError);
        return createError('DATABASE_ERROR', 'Failed to calculate dashboard statistics.');
      }
    }
  }

  /**
   * Retrieves detailed analytics for the analytics page.
   */
  async getDetailedAnalytics(): Promise<ServiceResult<DetailedAnalytics>> {
    console.log(`[AnalyticsService.getDetailedAnalytics] Trace: org=${this.context.organizationId}`);
    
    try {
      // 1. Try SDK
      const [statsRes, categoryRes, membersRes, eventsRes, trendsRes] = await Promise.all([
        this.sdk.database.from('donations').select('amount').eq('organization_id', this.context.organizationId).eq('status', 'successful'),
        this.sdk.database.from('donations').select('type, amount').eq('organization_id', this.context.organizationId).eq('status', 'successful'),
        this.sdk.database.from('users').select('*', { count: 'exact', head: true }).eq('organization_id', this.context.organizationId),
        this.sdk.database.from('events').select('*', { count: 'exact', head: true }).eq('organization_id', this.context.organizationId).gt('start_time', new Date().toISOString()),
        this.sdk.database.from('donations').select('amount, type, created_at').eq('organization_id', this.context.organizationId).eq('status', 'successful').order('created_at', { ascending: true }).limit(10)
      ]);

      if (statsRes.error || categoryRes.error || membersRes.error || eventsRes.error || trendsRes.error) throw new Error('SDK Detailed Analytics failed');

      const totalVolume = (statsRes.data || []).reduce((sum: number, d: { amount: number }) => sum + Number(d.amount), 0);
      const totalPayments = (statsRes.data || []).length;

      const categoriesRaw = categoryRes.data || [];
      const categories = ['zakat', 'sadaqah', 'general', 'campaign'].map(type => {
        const amount = categoriesRaw
          .filter((r: { type: string }) => r.type === type)
          .reduce((sum: number, r: { amount: number }) => sum + Number(r.amount), 0);
        return { name: type.charAt(0).toUpperCase() + type.slice(1), value: amount };
      });

      const trendRows = trendsRes.data || [];
      const maxTrendAmount = Math.max(...trendRows.map((r: { amount: number }) => Number(r.amount)), 100);
      const trendPoints = trendRows.map((row: { amount: number; created_at: string }, idx: number) => {
        const x = trendRows.length > 1 ? (idx / (trendRows.length - 1)) * 500 : 250;
        const y = 180 - (Number(row.amount) / maxTrendAmount) * 130 - 20;
        return { 
          x, 
          y, 
          amount: Number(row.amount), 
          time: new Date(row.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) 
        };
      });
      const polylinePoints = trendPoints.map(p => `${p.x},${p.y}`).join(' ');

      return createSuccess({
        totalVolume,
        totalPayments,
        totalMembers: membersRes.count || 0,
        upcomingEvents: eventsRes.count || 0,
        categories,
        trendPoints,
        polylinePoints
      });
    } catch (err) {
      // 2. Hybrid Fallback
      try {
        const [statsRes, categoryRes, membersRes, eventsRes, trendsRes] = await Promise.all([
          pool.query(`SELECT COALESCE(SUM(amount), 0) as total_volume, COUNT(id) as total_payments FROM donations WHERE organization_id = $1 AND status = 'successful'`, [this.context.organizationId]),
          pool.query(`SELECT type, COALESCE(SUM(amount), 0) as amount FROM donations WHERE organization_id = $1 AND status = 'successful' GROUP BY type`, [this.context.organizationId]),
          pool.query('SELECT COUNT(id) as count FROM users WHERE organization_id = $1', [this.context.organizationId]),
          pool.query('SELECT COUNT(id) as count FROM events WHERE organization_id = $1 AND start_time >= NOW()', [this.context.organizationId]),
          pool.query(`SELECT amount, type, created_at FROM donations WHERE organization_id = $1 AND status = 'successful' ORDER BY created_at ASC LIMIT 10`, [this.context.organizationId])
        ]);

        const categoriesRaw = categoryRes.rows;
        const categories = ['zakat', 'sadaqah', 'general', 'campaign'].map(type => {
          const row = categoriesRaw.find(r => r.type === type);
          return { name: type.charAt(0).toUpperCase() + type.slice(1), value: row ? Number(row.amount) : 0 };
        });

        const trendRows = trendsRes.rows;
        const maxTrendAmount = Math.max(...trendRows.map(r => Number(r.amount)), 100);
        const trendPoints = trendRows.map((row, idx) => {
          const x = trendRows.length > 1 ? (idx / (trendRows.length - 1)) * 500 : 250;
          const y = 180 - (Number(row.amount) / maxTrendAmount) * 130 - 20;
          return { 
            x, 
            y, 
            amount: Number(row.amount), 
            time: new Date(row.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) 
          };
        });
        const polylinePoints = trendPoints.map(p => `${p.x},${p.y}`).join(' ');

        return createSuccess({
          totalVolume: Number(statsRes.rows[0]?.total_volume || 0),
          totalPayments: Number(statsRes.rows[0]?.total_payments || 0),
          totalMembers: Number(membersRes.rows[0]?.count || 0),
          upcomingEvents: Number(eventsRes.rows[0]?.count || 0),
          categories,
          trendPoints,
          polylinePoints
        });
      } catch (poolError) {
        console.error('[AnalyticsService.getDetailedAnalytics] Critical Pool Error:', poolError);
        return createError('DATABASE_ERROR', 'Failed to fetch detailed analytics.');
      }
    }
  }

  /**
   * Retrieves engagement trends for charting.
   */
  async getEngagementTrends(): Promise<ServiceResult<EngagementTrend[]>> {
    // Current static implementation mirrored from existing UI for zero regression
    const mockTrends: EngagementTrend[] = [
      { label: 'MON', height: 60, value: '820' },
      { label: 'TUE', height: 45, value: '610' },
      { label: 'WED', height: 85, value: '1.1k' },
      { label: 'THU', height: 100, value: '1.4k' },
      { label: 'FRI', height: 70, value: '950' },
      { label: 'SAT', height: 55, value: '740' },
    ];
    return createSuccess(mockTrends);
  }
}
