import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:146523c620222f20b6d056d448f4d900@4bpch3kt.ap-southeast.database.insforge.app:5432/insforge?sslmode=require';

const pool = new Pool({
    connectionString,
});

if (!connectionString) {
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
