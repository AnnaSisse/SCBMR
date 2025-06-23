const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkConnections() {
    console.log('🔍 Checking Database Connections...\n');

    // Check environment variables
    console.log('📋 Environment Variables:');
    console.log(`Host: ${process.env.MYSQL_HOST || 'localhost (default)'}`);
    console.log(`User: ${process.env.MYSQL_USER || 'root (default)'}`);
    console.log(`Password: ${process.env.MYSQL_PASSWORD ? 'SET' : 'NOT SET'}`);
    console.log(`Database: ${process.env.MYSQL_DATABASE || 'hospital_db (default)'}`);
    console.log(`Port: ${process.env.MYSQL_PORT || '3306 (default)'}\n`);

    // Test basic connection
    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST || 'localhost',
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || '',
            port: parseInt(process.env.MYSQL_PORT || '3306')
        });

        const [result] = await connection.execute('SELECT NOW() as now');
        console.log('✅ Basic connection successful!');
        console.log(`Server time: ${result[0].now}`);
        await connection.end();
    } catch (error) {
        console.log('❌ Basic connection failed:', error.message);
        return;
    }

    // Test database connection
    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST || 'localhost',
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || '',
            database: process.env.MYSQL_DATABASE || 'hospital_db',
            port: parseInt(process.env.MYSQL_PORT || '3306')
        });

        const [tables] = await connection.execute('SHOW TABLES');
        console.log(`✅ Database connection successful!`);
        console.log(`Found ${tables.length} tables`);
        await connection.end();
    } catch (error) {
        console.log('❌ Database connection failed:', error.message);
    }
}

checkConnections().catch(console.error); 