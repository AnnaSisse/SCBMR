const mysql = require('mysql2/promise');

async function viewDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'hospital_db',
        port: parseInt(process.env.MYSQL_PORT || '3306')
    });

    try {
        console.log('🏥 Database Structure Viewer');
        console.log('============================\n');

        // Show all tables
        const [tables] = await connection.execute('SHOW TABLES');
        console.log('📋 Available Tables:');
        tables.forEach((table, index) => {
            const tableName = Object.values(table)[0];
            console.log(`${index + 1}. ${tableName}`);
        });

        console.log('\n📊 Table Details:');
        console.log('==================');

        // Get detailed information for each table
        for (const table of tables) {
            const tableName = Object.values(table)[0];
            console.log(`\n🔍 Table: ${tableName}`);
            console.log('-'.repeat(30));

            // Show table structure
            const [columns] = await connection.execute(`DESCRIBE ${tableName}`);
            console.log('Columns:');
            columns.forEach(col => {
                console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? '(NOT NULL)' : ''} ${col.Key === 'PRI' ? '(PRIMARY KEY)' : ''} ${col.Key === 'MUL' ? '(FOREIGN KEY)' : ''}`);
            });

            // Show row count
            const [countResult] = await connection.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
            console.log(`Rows: ${countResult[0].count}`);

            // Show sample data (first 3 rows)
            const [sampleData] = await connection.execute(`SELECT * FROM ${tableName} LIMIT 3`);
            if (sampleData.length > 0) {
                console.log('Sample Data:');
                sampleData.forEach((row, index) => {
                    console.log(`  Row ${index + 1}:`, JSON.stringify(row, null, 2));
                });
            }
        }

        // Show foreign key relationships
        console.log('\n🔗 Foreign Key Relationships:');
        console.log('============================');
        const [foreignKeys] = await connection.execute(`
            SELECT 
                TABLE_NAME,
                COLUMN_NAME,
                CONSTRAINT_NAME,
                REFERENCED_TABLE_NAME,
                REFERENCED_COLUMN_NAME
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
            WHERE REFERENCED_TABLE_SCHEMA = ? 
            AND REFERENCED_TABLE_NAME IS NOT NULL
        `, [process.env.MYSQL_DATABASE || 'hospital_db']);

        foreignKeys.forEach(fk => {
            console.log(`${fk.TABLE_NAME}.${fk.COLUMN_NAME} → ${fk.REFERENCED_TABLE_NAME}.${fk.REFERENCED_COLUMN_NAME}`);
        });

    } catch (error) {
        console.error('Error viewing database:', error);
    } finally {
        await connection.end();
    }
}

// Run the script
viewDatabase().catch(console.error); 