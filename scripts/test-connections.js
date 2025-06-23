const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnections() {
    console.log('🔍 Testing Database Connections...');
    console.log('================================\n');

    // Test 1: Environment Variables
    console.log('📋 Environment Variables Check:');
    console.log('-'.repeat(40));
    const envVars = {
        'MYSQL_HOST': process.env.MYSQL_HOST || 'localhost (default)',
        'MYSQL_USER': process.env.MYSQL_USER || 'root (default)',
        'MYSQL_PASSWORD': process.env.MYSQL_PASSWORD ? '***SET***' : '***NOT SET***',
        'MYSQL_DATABASE': process.env.MYSQL_DATABASE || 'hospital_db (default)',
        'MYSQL_PORT': process.env.MYSQL_PORT || '3306 (default)'
    };

    Object.entries(envVars).forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
    });

    // Test 2: Basic Connection Test
    console.log('\n🔌 Basic Connection Test:');
    console.log('-'.repeat(40));
    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST || 'localhost',
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || '',
            port: parseInt(process.env.MYSQL_PORT || '3306')
        });

        const [result] = await connection.execute('SELECT NOW() as now, VERSION() as version');
        console.log('✅ Connection successful!');
        console.log(`   Server Time: ${result[0].now}`);
        console.log(`   MySQL Version: ${result[0].version}`);
        await connection.end();
    } catch (error) {
        console.log('❌ Connection failed!');
        console.log(`   Error: ${error.message}`);
        return;
    }

    // Test 3: Database Existence Test
    console.log('\n🗄️ Database Existence Test:');
    console.log('-'.repeat(40));
    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST || 'localhost',
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || '',
            port: parseInt(process.env.MYSQL_PORT || '3306')
        });

        const dbName = process.env.MYSQL_DATABASE || 'hospital_db';
        const [databases] = await connection.execute('SHOW DATABASES');
        const dbExists = databases.some(db => db.Database === dbName);
        
        if (dbExists) {
            console.log(`✅ Database '${dbName}' exists`);
        } else {
            console.log(`❌ Database '${dbName}' does not exist`);
            console.log('   Available databases:');
            databases.forEach(db => console.log(`   - ${db.Database}`));
        }
        await connection.end();
    } catch (error) {
        console.log(`❌ Error checking database: ${error.message}`);
    }

    // Test 4: Full Database Connection Test
    console.log('\n🏥 Full Database Connection Test:');
    console.log('-'.repeat(40));
    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST || 'localhost',
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || '',
            database: process.env.MYSQL_DATABASE || 'hospital_db',
            port: parseInt(process.env.MYSQL_PORT || '3306')
        });

        // Test if we can query the database
        const [tables] = await connection.execute('SHOW TABLES');
        console.log(`✅ Successfully connected to database '${process.env.MYSQL_DATABASE || 'hospital_db'}'`);
        console.log(`   Found ${tables.length} tables`);
        
        if (tables.length > 0) {
            console.log('   Tables:');
            tables.forEach((table, index) => {
                const tableName = Object.values(table)[0];
                console.log(`   ${index + 1}. ${tableName}`);
            });
        } else {
            console.log('   ⚠️ No tables found - database might be empty');
        }

        await connection.end();
    } catch (error) {
        console.log(`❌ Database connection failed: ${error.message}`);
    }

    // Test 5: Pool Connection Test
    console.log('\n🏊 Connection Pool Test:');
    console.log('-'.repeat(40));
    try {
        const pool = mysql.createPool({
            host: process.env.MYSQL_HOST || 'localhost',
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || '',
            database: process.env.MYSQL_DATABASE || 'hospital_db',
            port: parseInt(process.env.MYSQL_PORT || '3306'),
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            multipleStatements: true,
        });

        const [result] = await pool.query('SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = ?', 
            [process.env.MYSQL_DATABASE || 'hospital_db']);
        
        console.log(`✅ Pool connection successful!`);
        console.log(`   Tables in database: ${result[0].table_count}`);
        
        await pool.end();
    } catch (error) {
        console.log(`❌ Pool connection failed: ${error.message}`);
    }

    // Test 6: API Endpoint Test
    console.log('\n🌐 API Endpoint Test:');
    console.log('-'.repeat(40));
    try {
        const response = await fetch('http://localhost:3000/api/test-db');
        const data = await response.json();
        
        if (data.success) {
            console.log('✅ API endpoint /api/test-db is working');
            console.log(`   Response: ${data.message}`);
            console.log(`   Timestamp: ${data.timestamp}`);
        } else {
            console.log('❌ API endpoint /api/test-db failed');
            console.log(`   Error: ${data.error || data.message}`);
        }
    } catch (error) {
        console.log('❌ API endpoint test failed');
        console.log(`   Error: ${error.message}`);
        console.log('   Make sure your Next.js server is running on port 3000');
    }

    // Test 7: Specific Table Tests
    console.log('\n📊 Table Structure Tests:');
    console.log('-'.repeat(40));
    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST || 'localhost',
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || '',
            database: process.env.MYSQL_DATABASE || 'hospital_db',
            port: parseInt(process.env.MYSQL_PORT || '3306')
        });

        const expectedTables = ['patients', 'doctors', 'appointments', 'medical_records', 'medications', 'prescription_medications', 'users'];
        
        for (const tableName of expectedTables) {
            try {
                const [result] = await connection.execute(`DESCRIBE ${tableName}`);
                console.log(`✅ Table '${tableName}' exists with ${result.length} columns`);
            } catch (error) {
                console.log(`❌ Table '${tableName}' does not exist or is not accessible`);
            }
        }

        await connection.end();
    } catch (error) {
        console.log(`❌ Table structure test failed: ${error.message}`);
    }

    console.log('\n🎯 Connection Test Summary:');
    console.log('==========================');
    console.log('If you see ✅ marks above, your connections are working properly.');
    console.log('If you see ❌ marks, check the error messages for troubleshooting.');
    console.log('\nTo fix connection issues:');
    console.log('1. Ensure MySQL server is running');
    console.log('2. Check your environment variables (.env file)');
    console.log('3. Verify database credentials');
    console.log('4. Make sure the database exists');
    console.log('5. Check firewall/network settings');
}

// Run the tests
testConnections().catch(console.error); 