const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
});

async function setupMedications() {
    try {
        // Read the SQL file
        const sqlFile = path.join(__dirname, 'schema', 'medications.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');

        // Execute the SQL
        await pool.query(sql);
        console.log('Medication tables created successfully');
    } catch (error) {
        console.error('Error setting up medication tables:', error);
    } finally {
        await pool.end();
    }
}

setupMedications(); 