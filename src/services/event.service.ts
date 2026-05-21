import pool from '@/lib/db';
import { TenantContext } from './core/tenant';
import { ServiceResult, createSuccess, createError } from './core/types';

export interface Event {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string | null;
  location: string | null;
  capacity: number | null;
  organization_id: string;
}

export class EventService {
  constructor(private context: TenantContext) {}

  /**
   * Retrieves all events for the current organization.
   */
  async getEvents(): Promise<ServiceResult<Event[]>> {
    console.log(`[EventService.getEvents] Trace: org=${this.context.organizationId}`);
    
    try {
      const { rows } = await pool.query(
        'SELECT id, title, description, start_time, end_time, location, capacity FROM events WHERE organization_id = $1 ORDER BY start_time ASC',
        [this.context.organizationId]
      );
      return createSuccess(rows);
    } catch (error) {
      console.error('[EventService.getEvents] Critical Pool Error:', error);
      return createError('DATABASE_ERROR', 'Failed to fetch the program schedule.');
    }
  }

  /**
   * Creates a new community program/event.
   */
  async createEvent(data: {
    title: string;
    description?: string | null;
    location?: string | null;
    capacity?: number | null;
    startTime: string;
    endTime?: string | null;
  }): Promise<ServiceResult<Event>> {
    console.log(`[EventService.createEvent] Trace: org=${this.context.organizationId}, title=${data.title}`);
    
    try {
      const startTime = new Date(data.startTime);
      const endTime = data.endTime 
        ? new Date(data.endTime) 
        : new Date(startTime.getTime() + 2 * 60 * 60 * 1000);

      const { rows } = await pool.query(
        `INSERT INTO events (title, description, start_time, end_time, location, capacity, organization_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING id, title, description, start_time, end_time, location, capacity`,
        [
          data.title,
          data.description || null,
          startTime.toISOString(),
          endTime.toISOString(),
          data.location || null,
          data.capacity || 100,
          this.context.organizationId
        ]
      );
      return createSuccess(rows[0]);
    } catch (error) {
      console.error('[EventService.createEvent] Critical Pool Error:', error);
      return createError('DATABASE_ERROR', 'Failed to publish the new program.');
    }
  }
}
