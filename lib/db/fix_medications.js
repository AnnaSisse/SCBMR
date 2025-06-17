const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Create a new pool using environment variables
const pool = new Pool({
    user: process.env.POSTGRES_USER || 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_DB || 'scbmr',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    port: process.env.POSTGRES_PORT || 5432,
});

async function fixMedications() {
    try {
        // Read the SQL file
        const sqlFile = path.join(__dirname, 'fix_medications.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');

        // Execute the SQL
        await pool.query(sql);
        console.log('Medications table structure fixed successfully');
    } catch (error) {
        console.error('Error fixing medications table:', error);
    } finally {
        await pool.end();
    }
}

fixMedications(); 