import { Pool, QueryResult, QueryResultRow, PoolClient } from 'pg';

/**
 * Custom error class for database configuration issues.
 * Provides typed error handling for infrastructure failures.
 */
export class DatabaseConfigurationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DatabaseConfigurationError';
        // Ensure stack trace is captured correctly in Node.js
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DatabaseConfigurationError);
        }
    }
}

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString,
    // Add production-ready defaults
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

if (!connectionString) {
    const throwMissingDbUrl = () => {
        throw new DatabaseConfigurationError(
            'DATABASE_URL is not set in environment variables. ' +
            'Database operations cannot proceed without a valid connection string.'
        );
    };

    // Override pool methods to prevent runtime queries with undefined configuration
    // and provide clear, typed feedback to the developer.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pool.query = throwMissingDbUrl as <R extends QueryResultRow = any, I extends any[] = any[]>(queryTextOrConfig: string | any, values?: I) => Promise<QueryResult<R>>;
    pool.connect = throwMissingDbUrl as () => Promise<PoolClient>;
}

export default pool;
