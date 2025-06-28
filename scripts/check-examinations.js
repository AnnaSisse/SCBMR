const mysql = require('mysql2/promise');

async function checkExaminations() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'hospital_db'
    });

    console.log('🔍 Checking examinations in database...');

    // Check if examinations table exists
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'examinations'"
    );

    if (tables.length === 0) {
      console.log('❌ Examinations table does not exist!');
      return;
    }

    // Count total examinations
    const [countResult] = await connection.execute(
      'SELECT COUNT(*) as total FROM examinations'
    );
    const totalExaminations = countResult[0].total;

    console.log(`📊 Total examinations: ${totalExaminations}`);

    if (totalExaminations > 0) {
      // Get sample examinations
      const [examinations] = await connection.execute(
        'SELECT * FROM examinations LIMIT 5'
      );
      
      console.log('\n📋 Sample examinations:');
      examinations.forEach((exam, index) => {
        console.log(`${index + 1}. Patient ID: ${exam.patient_id}, Doctor ID: ${exam.doctor_id}, Type: ${exam.type || 'N/A'}, Date: ${exam.date}`);
      });

      // Get examinations by patient
      const [patientStats] = await connection.execute(
        'SELECT patient_id, COUNT(*) as exam_count FROM examinations GROUP BY patient_id'
      );
      
      console.log('\n👥 Examinations by patient:');
      patientStats.forEach(stat => {
        console.log(`Patient ${stat.patient_id}: ${stat.exam_count} examinations`);
      });

      // Get examinations by doctor
      const [doctorStats] = await connection.execute(
        'SELECT doctor_id, COUNT(*) as exam_count FROM examinations GROUP BY doctor_id'
      );
      
      console.log('\n👨‍⚕️ Examinations by doctor:');
      doctorStats.forEach(stat => {
        console.log(`Doctor ${stat.doctor_id}: ${stat.exam_count} examinations`);
      });

    } else {
      console.log('📝 No examinations found in the database.');
      console.log('💡 You can create examinations using the API or seed data.');
    }

  } catch (error) {
    console.error('❌ Error checking examinations:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Load environment variables
require('dotenv').config();

// Run the check
checkExaminations(); 