import { query } from './queries';

export async function seedDatabase() {
    try {
        // Add test doctors
        const doctors = await query(`
            INSERT INTO doctors (first_name, last_name, specialization, phone_number, email)
            VALUES 
                ('Sarah', 'Johnson', 'Cardiology', '1234567890', 'sarah.johnson@hospital.com'),
                ('Michael', 'Chen', 'Neurology', '2345678901', 'michael.chen@hospital.com'),
                ('Emily', 'Brown', 'Pediatrics', '3456789012', 'emily.brown@hospital.com')
            RETURNING *
        `);

        // Add test patients
        const patients = await query(`
            INSERT INTO patients (first_name, last_name, date_of_birth, gender, phone_number, email, address)
            VALUES 
                ('John', 'Doe', '1990-01-01', 'Male', '4567890123', 'john.doe@email.com', '123 Main St'),
                ('Jane', 'Smith', '1985-05-15', 'Female', '5678901234', 'jane.smith@email.com', '456 Oak Ave'),
                ('Robert', 'Wilson', '1978-11-30', 'Male', '6789012345', 'robert.wilson@email.com', '789 Pine Rd')
            RETURNING *
        `);

        // Add test medications
        const medications = await query(`
            INSERT INTO medications (name, description, dosage, category)
            VALUES 
                ('Aspirin', 'Pain reliever and anti-inflammatory', '325mg', 'Analgesic'),
                ('Amoxicillin', 'Antibiotic for bacterial infections', '500mg', 'Antibiotic'),
                ('Lisinopril', 'Blood pressure medication', '10mg', 'Antihypertensive')
            RETURNING *
        `);

        // Add test appointments
        const appointments = await query(`
            INSERT INTO appointments (patient_id, doctor_id, appointment_date, status, notes)
            VALUES 
                (${patients.rows[0].patient_id}, ${doctors.rows[0].doctor_id}, '2024-03-20 10:00:00', 'scheduled', 'Regular checkup'),
                (${patients.rows[1].patient_id}, ${doctors.rows[1].doctor_id}, '2024-03-21 14:30:00', 'scheduled', 'Follow-up consultation'),
                (${patients.rows[2].patient_id}, ${doctors.rows[2].doctor_id}, '2024-03-22 09:15:00', 'scheduled', 'Initial consultation')
            RETURNING *
        `);

        // Add test medical records
        const medicalRecords = await query(`
            INSERT INTO medical_records (patient_id, doctor_id, diagnosis, prescription, visit_date)
            VALUES 
                (${patients.rows[0].patient_id}, ${doctors.rows[0].doctor_id}, 'Hypertension', 'Prescribed Lisinopril', '2024-03-15'),
                (${patients.rows[1].patient_id}, ${doctors.rows[1].doctor_id}, 'Migraine', 'Prescribed pain management', '2024-03-16'),
                (${patients.rows[2].patient_id}, ${doctors.rows[2].doctor_id}, 'Common cold', 'Rest and fluids', '2024-03-17')
            RETURNING *
        `);

        // Add test prescription medications
        const prescriptionMedications = await query(`
            INSERT INTO prescription_medications (record_id, medication_id, dosage, frequency, duration)
            VALUES 
                (${medicalRecords.rows[0].record_id}, ${medications.rows[2].medication_id}, '10mg', 'Once daily', '30 days'),
                (${medicalRecords.rows[1].record_id}, ${medications.rows[0].medication_id}, '325mg', 'As needed', '7 days'),
                (${medicalRecords.rows[2].record_id}, ${medications.rows[1].medication_id}, '500mg', 'Three times daily', '10 days')
            RETURNING *
        `);

        console.log('Database seeded successfully!');
        return {
            doctors: doctors.rows,
            patients: patients.rows,
            medications: medications.rows,
            appointments: appointments.rows,
            medicalRecords: medicalRecords.rows,
            prescriptionMedications: prescriptionMedications.rows
        };
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
} 