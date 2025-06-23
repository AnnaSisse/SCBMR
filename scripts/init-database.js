const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function initDatabase() {
    console.log('🏥 Initializing Hospital Management System Database...\n');

    const config = {
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        port: parseInt(process.env.MYSQL_PORT || '3306'),
        database: process.env.MYSQL_DATABASE || 'hospital_db'
    };

    console.log('📋 Database Configuration:');
    console.log(`Host: ${config.host}`);
    console.log(`User: ${config.user}`);
    console.log(`Password: ${config.password ? 'SET' : 'NOT SET'}`);
    console.log(`Port: ${config.port}`);
    console.log(`Database: ${config.database}\n`);

    let connection;

    try {
        // Step 1: Connect to MySQL server to create the database
        console.log('🔌 Connecting to MySQL server to create database...');
        let serverConnection = await mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            port: config.port
        });

        console.log('🗄️ Creating database...');
        await serverConnection.execute(`CREATE DATABASE IF NOT EXISTS \`${config.database}\``);
        await serverConnection.end();
        console.log(`✅ Database '${config.database}' created/verified successfully!\n`);

        // Step 2: Connect directly to the newly created database
        console.log(`🔌 Connecting to database '${config.database}'...`);
        connection = await mysql.createConnection({ ...config, multipleStatements: true });
        console.log('✅ Connected to database successfully!\n');

        // Step 3: Apply schema
        console.log('📋 Applying database schema...');
        const schemaPath = path.join(__dirname, '../lib/db/medical_schema.sql');
        const schema = await fs.readFile(schemaPath, 'utf8');
        await connection.query(schema); // Run the entire schema at once
        console.log('✅ Database schema applied successfully!\n');

        // Step 4: Seed data
        console.log('🌱 Seeding database with initial data...');
        await seedInitialData(connection);
        console.log('✅ Database seeded successfully!\n');

        // Step 5: Verify setup
        console.log('🔍 Final verification...');
        await verifyDatabaseSetup(connection);
        console.log('✅ Database initialization completed successfully!\n');

    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

async function seedInitialData(connection) {
    // Create initial users
    const users = [
        {
            first_name: 'System',
            last_name: 'Administrator',
            email: 'admin@hospital.com',
            password: 'admin123',
            role: 'Admin',
            phone: '+1-555-0001',
            department: 'Administration'
        },
        {
            first_name: 'Dr. Sarah',
            last_name: 'Johnson',
            email: 'doctor@hospital.com',
            password: 'doctor123',
            role: 'Doctor',
            phone: '+1-555-0002',
            department: 'Cardiology'
        },
        {
            first_name: 'Nurse Mary',
            last_name: 'Wilson',
            email: 'nurse@hospital.com',
            password: 'nurse123',
            role: 'Nurse',
            phone: '+1-555-0004',
            department: 'Emergency'
        }
    ];

    for (const user of users) {
        await connection.execute(
            'INSERT INTO users (first_name, last_name, email, password, role, phone, department) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [user.first_name, user.last_name, user.email, user.password, user.role, user.phone, user.department]
        );
    }

    // Create initial doctors
    const doctors = [
        {
            first_name: 'Dr. Sarah',
            last_name: 'Johnson',
            specialization: 'Cardiology',
            phone_number: '+1-555-0002',
            email: 'doctor@hospital.com'
        }
    ];

    for (const doctor of doctors) {
        await connection.execute(
            'INSERT INTO doctors (first_name, last_name, specialization, phone_number, email) VALUES (?, ?, ?, ?, ?)',
            [doctor.first_name, doctor.last_name, doctor.specialization, doctor.phone_number, doctor.email]
        );
    }

    // Create initial patients
    const patients = [
        {
            first_name: 'John',
            last_name: 'Patient',
            date_of_birth: '1985-06-15',
            gender: 'Male',
            phone_number: '+1-555-0003',
            email: 'patient@hospital.com',
            address: '123 Main St, City, State 12345'
        }
    ];

    for (const patient of patients) {
        await connection.execute(
            'INSERT INTO patients (first_name, last_name, date_of_birth, gender, phone_number, email, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [patient.first_name, patient.last_name, patient.date_of_birth, patient.gender, patient.phone_number, patient.email, patient.address]
        );
    }
}

async function verifyDatabaseSetup(connection) {
    const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
    const [doctors] = await connection.execute('SELECT COUNT(*) as count FROM doctors');
    const [patients] = await connection.execute('SELECT COUNT(*) as count FROM patients');
    const [tables] = await connection.execute('SHOW TABLES');
    
    console.log(`   Users: ${users[0].count}`);
    console.log(`   Doctors: ${doctors[0].count}`);
    console.log(`   Patients: ${patients[0].count}`);
    console.log(`   Total Tables: ${tables.length}`);
}

if (require.main === module) {
    initDatabase()
        .then(() => {
            console.log('🎉 Database initialization completed successfully!');
            console.log('\n📝 Next steps:');
            console.log('1. Set up your environment variables in .env.local');
            console.log('2. Run: npm run dev');
            console.log('3. Test the application with the provided credentials');
            console.log('\n🔑 Default login credentials:');
            console.log('Admin: admin@hospital.com / admin123');
            console.log('Doctor: doctor@hospital.com / doctor123');
            console.log('Nurse: nurse@hospital.com / nurse123');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Database initialization failed:', error);
            process.exit(1);
        });
}

module.exports = { initDatabase }; 