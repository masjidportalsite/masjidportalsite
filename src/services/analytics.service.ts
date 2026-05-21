import pool from '@/lib/db';
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
  constructor(private context: TenantContext) {}

  /**
   * Aggregates key performance indicators for the organization dashboard.
   */
  async getDashboardSummary(): Promise<ServiceResult<DashboardStats>> {
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
        activeProgramsCount: 8, // Placeholder for Phase 2: Dynamic calculation
        pendingApprovalsCount: 12, // Placeholder
        activeVolunteersCount: parseInt(volunteerRes.rows[0]?.count || '0', 10),
        avgWeeklyAttendance: 850, // Placeholder
        nextEvent,
        eventCapacityLabel
      });
    } catch (error) {
      console.error('[AnalyticsService.getDashboardSummary] Error:', error);
      return createError('DATABASE_ERROR', 'Failed to calculate dashboard statistics.');
    }
  }

  /**
   * Retrieves detailed analytics for the analytics page.
   */
  async getDetailedAnalytics(): Promise<ServiceResult<DetailedAnalytics>> {
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
    } catch (error) {
      console.error('[AnalyticsService.getDetailedAnalytics] Error:', error);
      return createError('DATABASE_ERROR', 'Failed to fetch detailed analytics.');
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
