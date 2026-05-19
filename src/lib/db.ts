import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL is not set in environment variables. Please check your database configuration.');
}

const pool = new Pool({
    connectionString,
});

export default pool;
