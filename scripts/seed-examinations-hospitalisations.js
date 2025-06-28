const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  port: 3306,
  database: 'hospital_db'
};

async function seedExaminationsAndHospitalisations() {
  let connection;
  
  try {
    console.log('🌱 Seeding examinations and hospitalisations data...');
    
    connection = await mysql.createConnection(dbConfig);
    
    // Get existing patients and doctors
    const [patients] = await connection.execute('SELECT patient_id FROM patients LIMIT 5');
    const [doctors] = await connection.execute('SELECT doctor_id FROM doctors LIMIT 3');
    
    if (patients.length === 0 || doctors.length === 0) {
      console.log('❌ No patients or doctors found. Please run seed-data.js first.');
      return;
    }
    
    // Sample examination data
    const examinationData = [
      {
        patient_id: patients[0].patient_id,
        doctor_id: doctors[0].doctor_id,
        examination_type: 'Physical Examination',
        findings: 'Patient appears healthy with normal vital signs',
        recommendations: 'Continue current medication regimen',
        notes: 'Regular checkup completed successfully'
      },
      {
        patient_id: patients[0].patient_id,
        doctor_id: doctors[0].doctor_id,
        examination_type: 'Blood Test',
        findings: 'Normal blood count, slightly elevated cholesterol',
        recommendations: 'Reduce dietary fat intake',
        notes: 'Follow up in 3 months'
      },
      {
        patient_id: patients[0].patient_id,
        doctor_id: doctors[0].doctor_id,
        examination_type: 'X-Ray',
        findings: 'No abnormalities detected in chest X-ray',
        recommendations: 'No further action required',
        notes: 'Routine screening completed'
      }
    ];
    
    // Sample hospitalisation data
    const hospitalisationData = [
      {
        patient_id: patients[0].patient_id,
        doctor_id: doctors[0].doctor_id,
        admission_date: new Date('2024-01-15'),
        ward: 'General Ward',
        room: '101',
        reason: 'Appendicitis surgery',
        status: 'discharged',
        discharge_date: new Date('2024-01-18'),
        notes: 'Successful laparoscopic appendectomy'
      },
      {
        patient_id: patients[0].patient_id,
        doctor_id: doctors[0].doctor_id,
        admission_date: new Date('2024-03-10'),
        ward: 'Cardiology',
        room: '205',
        reason: 'Chest pain evaluation',
        status: 'discharged',
        discharge_date: new Date('2024-03-12'),
        notes: 'Ruled out cardiac issues, discharged with medication'
      }
    ];
    
    // Insert examinations
    for (const exam of examinationData) {
      await connection.execute(
        `INSERT INTO examinations (patient_id, doctor_id, examination_type, findings, recommendations, notes, examination_date)
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [exam.patient_id, exam.doctor_id, exam.examination_type, exam.findings, exam.recommendations, exam.notes]
      );
    }
    
    // Insert hospitalisations
    for (const hosp of hospitalisationData) {
      await connection.execute(
        `INSERT INTO hospitalisations (patient_id, doctor_id, admission_date, discharge_date, ward, room, reason, status, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [hosp.patient_id, hosp.doctor_id, hosp.admission_date, hosp.discharge_date, hosp.ward, hosp.room, hosp.reason, hosp.status, hosp.notes]
      );
    }
    
    console.log('✅ Successfully seeded examinations and hospitalisations data!');
    
    // Verify the data
    const [examCount] = await connection.execute('SELECT COUNT(*) as count FROM examinations');
    const [hospCount] = await connection.execute('SELECT COUNT(*) as count FROM hospitalisations');
    
    console.log(`📊 Data summary:`);
    console.log(`   Examinations: ${examCount[0].count}`);
    console.log(`   Hospitalisations: ${hospCount[0].count}`);
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedExaminationsAndHospitalisations(); 