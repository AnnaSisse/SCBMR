const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  port: 3306,
  database: 'hospital_db'
};

async function testPatientId() {
  let connection;
  
  try {
    console.log('🔍 Testing patient ID issue...');
    
    connection = await mysql.createConnection(dbConfig);
    
    // Check if patient with ID 1 exists
    const [patient1] = await connection.execute('SELECT * FROM patients WHERE patient_id = 1');
    console.log('Patient with ID 1:', patient1[0]);
    
    // Check if there are any patients with alphanumeric IDs
    const [allPatients] = await connection.execute('SELECT * FROM patients');
    console.log('All patients:', allPatients);
    
    // Check examinations for patient 1
    const [exams] = await connection.execute('SELECT * FROM examinations WHERE patient_id = 1');
    console.log('Examinations for patient 1:', exams);
    
    // Check hospitalisations for patient 1
    const [hosp] = await connection.execute('SELECT * FROM hospitalisations WHERE patient_id = 1');
    console.log('Hospitalisations for patient 1:', hosp);
    
    // Create a new patient with more complete data
    const [result] = await connection.execute(
      `INSERT INTO patients (first_name, last_name, date_of_birth, gender, phone_number, email, address)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['Jane', 'Doe', '1990-05-15', 'Female', '+1-555-0123', 'jane.doe@email.com', '456 Oak St, City, State 54321']
    );
    
    const newPatientId = result.insertId;
    console.log('Created new patient with ID:', newPatientId);
    
    // Add some examinations for the new patient
    await connection.execute(
      `INSERT INTO examinations (patient_id, doctor_id, examination_type, findings, recommendations, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [newPatientId, 1, 'Physical Examination', 'Patient in good health', 'Continue regular checkups', 'Annual physical completed']
    );
    
    // Add a hospitalisation for the new patient
    await connection.execute(
      `INSERT INTO hospitalisations (patient_id, doctor_id, admission_date, ward, room, reason, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [newPatientId, 1, new Date('2024-02-15'), 'Emergency', 'ER-1', 'Accident evaluation', 'discharged']
    );
    
    console.log('✅ Added sample data for new patient');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testPatientId(); 