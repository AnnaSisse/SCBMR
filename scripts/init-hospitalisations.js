const mysql = require('mysql2/promise');

async function initHospitalisationsTables() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'scbmr_db'
    });

    console.log('🔧 Initializing hospitalisations and examinations tables...');

    // Create hospitalisations table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS hospitalisations (
        hospitalisation_id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT,
        doctor_id INT,
        admission_date DATE NOT NULL,
        discharge_date DATE,
        ward VARCHAR(100),
        room VARCHAR(50),
        reason TEXT,
        status VARCHAR(50) DEFAULT 'admitted',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
        FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE
      )
    `);

    // Create examinations table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS examinations (
        examination_id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT,
        doctor_id INT,
        date DATE NOT NULL,
        type VARCHAR(100),
        result TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
        FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Successfully created hospitalisations and examinations tables!');

    // Check if tables exist and have data
    const [hospCount] = await connection.execute('SELECT COUNT(*) as count FROM hospitalisations');
    const [examCount] = await connection.execute('SELECT COUNT(*) as count FROM examinations');
    
    console.log(`📊 Current data counts:`);
    console.log(`   Hospitalisations: ${hospCount[0].count}`);
    console.log(`   Examinations: ${examCount[0].count}`);

  } catch (error) {
    console.error('❌ Error initializing tables:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Load environment variables
require('dotenv').config();

// Run the initialization
initHospitalisationsTables(); 