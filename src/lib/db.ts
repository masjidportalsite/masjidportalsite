import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://dummy:dummy@localhost:5432/dummy';

const pool = new Pool({
    connectionString,
});

if (!process.env.DATABASE_URL) {
    const throwMissingDbUrl = () => {
        throw new Error('DATABASE_URL is not set in environment variables. Please check your database configuration.');
    };

    // Override pool methods to prevent runtime queries without DATABASE_URL
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pool.query = throwMissingDbUrl as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pool.connect = throwMissingDbUrl as any;
}

export default pool;
