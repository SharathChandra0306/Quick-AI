import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

// Initialize database tables
export const initDatabase = async () => {
    try {
        // Users table for additional user data
        await sql`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                clerk_id VARCHAR(255) UNIQUE NOT NULL,
                email VARCHAR(255) NOT NULL,
                full_name VARCHAR(255),
                plan VARCHAR(50) DEFAULT 'free',
                free_usage INTEGER DEFAULT 0,
                total_generations INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        // Creations table for storing AI generations
        await sql`
            CREATE TABLE IF NOT EXISTS creations (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                type VARCHAR(50) NOT NULL,
                prompt TEXT,
                content TEXT,
                metadata JSONB,
                is_public BOOLEAN DEFAULT false,
                likes_count INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        // Community posts table
        await sql`
            CREATE TABLE IF NOT EXISTS community_posts (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                type VARCHAR(50) NOT NULL,
                tags TEXT[],
                likes_count INTEGER DEFAULT 0,
                comments_count INTEGER DEFAULT 0,
                is_featured BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        // Community likes table
        await sql`
            CREATE TABLE IF NOT EXISTS community_likes (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                post_id INTEGER REFERENCES community_posts(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, post_id)
            )
        `;

        // Community comments table
        await sql`
            CREATE TABLE IF NOT EXISTS community_comments (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                post_id INTEGER REFERENCES community_posts(id) ON DELETE CASCADE,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
    }
};

export default sql;