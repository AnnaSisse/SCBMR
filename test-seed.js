const mysql = require('mysql2/promise');

async function seedTestData() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'hospital_db'
    });

    try {
        // Add a test doctor
        const [doctorResult] = await connection.execute(
            'INSERT INTO doctors (first_name, last_name, specialization, phone_number, email) VALUES (?, ?, ?, ?, ?)',
            ['Dr. Sarah', 'Johnson', 'Cardiology', '+1-555-0001', 'sarah.johnson@hospital.com']
        );
        console.log('Doctor created with ID:', doctorResult.insertId);

        // Add a test patient
        const [patientResult] = await connection.execute(
            'INSERT INTO patients (first_name, last_name, date_of_birth, gender, phone_number, email, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
            ['John', 'Doe', '1990-01-01', 'Male', '+1-555-0002', 'john.doe@example.com', '123 Main St']
        );
        console.log('Patient created with ID:', patientResult.insertId);

        console.log('Test data seeded successfully!');
    } catch (error) {
        console.error('Error seeding test data:', error);
    } finally {
        await connection.end();
    }
}

seedTestData(); 