import { NextResponse } from 'next/server';
import { query } from '@/lib/db/queries';

export async function GET() {
    const results = {
        environment: {},
        basicConnection: false,
        databaseConnection: false,
        tables: [],
        errors: []
    };

    try {
        // Check environment variables
        results.environment = {
            host: process.env.MYSQL_HOST || 'localhost (default)',
            user: process.env.MYSQL_USER || 'root (default)',
            password: process.env.MYSQL_PASSWORD ? 'SET' : 'NOT SET',
            database: process.env.MYSQL_DATABASE || 'hospital_db (default)',
            port: process.env.MYSQL_PORT || '3306 (default)'
        };

        // Test basic connection
        try {
            const result = await query('SELECT NOW() as now, VERSION() as version');
            results.basicConnection = true;
            results.serverInfo = {
                time: result[0].now,
                version: result[0].version
            };
        } catch (error) {
            results.errors.push(`Basic connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        // Test database-specific connection
        try {
            const tables = await query('SHOW TABLES');
            results.databaseConnection = true;
            results.tables = tables.map(table => Object.values(table)[0]);
        } catch (error) {
            results.errors.push(`Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        // Test specific tables if database connection works
        if (results.databaseConnection) {
            const expectedTables = ['patients', 'doctors', 'appointments', 'medical_records', 'medications', 'prescription_medications', 'users'];
            results.tableStatus = {};
            
            for (const tableName of expectedTables) {
                try {
                    const tableInfo = await query(`DESCRIBE ${tableName}`);
                    results.tableStatus[tableName] = {
                        exists: true,
                        columns: tableInfo.length
                    };
                } catch (error) {
                    results.tableStatus[tableName] = {
                        exists: false,
                        error: error instanceof Error ? error.message : 'Unknown error'
                    };
                }
            }
        }

        const success = results.basicConnection && results.databaseConnection && results.errors.length === 0;

        return NextResponse.json({
            success,
            message: success ? 'All connections are working properly' : 'Some connections have issues',
            results
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Connection check failed',
            error: error instanceof Error ? error.message : 'Unknown error',
            results
        }, { status: 500 });
    }
} 