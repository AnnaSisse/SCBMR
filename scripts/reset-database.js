const mysql = require('mysql2/promise');
require('dotenv').config();

async function resetDatabase() {
    console.log('🔄 Resetting Hospital Management System Database...\n');

    const config = {
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        port: parseInt(process.env.MYSQL_PORT || '3306'),
        database: process.env.MYSQL_DATABASE || 'hospital_db'
    };

    let connection;

    try {
        // Connect to MySQL server
        console.log('🔌 Connecting to MySQL server...');
        connection = await mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            port: config.port
        });

        console.log('✅ Connected to MySQL server successfully!\n');

        // Drop database if it exists
        console.log('🗑️ Dropping existing database...');
        await connection.execute(`DROP DATABASE IF EXISTS \`${config.database}\``);
        console.log(`✅ Database '${config.database}' dropped successfully!\n`);

        // Create fresh database
        console.log('🗄️ Creating fresh database...');
        await connection.execute(`CREATE DATABASE \`${config.database}\``);
        console.log(`✅ Database '${config.database}' created successfully!\n`);

        console.log('✅ Database reset completed successfully!');
        console.log('\n📝 Next steps:');
        console.log('1. Run: npm run db:init (to initialize with schema and data)');
        console.log('2. Run: npm run dev (to start the application)');

    } catch (error) {
        console.error('❌ Database reset failed:', error.message);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

if (require.main === module) {
    resetDatabase()
        .then(() => {
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Database reset failed:', error);
            process.exit(1);
        });
}

module.exports = { resetDatabase }; 