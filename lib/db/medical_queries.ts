import { query } from './queries';

// Patient Operations
export async function createPatient(patientData: {
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    gender?: string;
    phone_number?: string;
    email?: string;
    address?: string;
}) {
    const result = await query(
        `INSERT INTO patients (first_name, last_name, date_of_birth, gender, phone_number, email, address)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [patientData.first_name, patientData.last_name, patientData.date_of_birth, 
         patientData.gender, patientData.phone_number, patientData.email, patientData.address]
    );
    return result.rows[0];
}

export async function getPatient(patientId: number) {
    const result = await query(
        'SELECT * FROM patients WHERE patient_id = $1',
        [patientId]
    );
    return result.rows[0];
}

// Doctor Operations
export async function createDoctor(doctorData: {
    first_name: string;
    last_name: string;
    specialization?: string;
    phone_number?: string;
    email?: string;
}) {
    const result = await query(
        `INSERT INTO doctors (first_name, last_name, specialization, phone_number, email)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [doctorData.first_name, doctorData.last_name, doctorData.specialization,
         doctorData.phone_number, doctorData.email]
    );
    return result.rows[0];
}

// Appointment Operations
export async function createAppointment(appointmentData: {
    patient_id: number;
    doctor_id: number;
    appointment_date: Date;
    status?: string;
    notes?: string;
}) {
    const result = await query(
        `INSERT INTO appointments (patient_id, doctor_id, appointment_date, status, notes)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [appointmentData.patient_id, appointmentData.doctor_id, appointmentData.appointment_date,
         appointmentData.status || 'scheduled', appointmentData.notes]
    );
    return result.rows[0];
}

export async function getPatientAppointments(patientId: number) {
    const result = await query(
        `SELECT a.*, d.first_name as doctor_first_name, d.last_name as doctor_last_name
         FROM appointments a
         JOIN doctors d ON a.doctor_id = d.doctor_id
         WHERE a.patient_id = $1
         ORDER BY a.appointment_date DESC`,
        [patientId]
    );
    return result.rows;
}

// Medical Record Operations
export async function createMedicalRecord(recordData: {
    patient_id: number;
    doctor_id: number;
    diagnosis: string;
    prescription?: string;
}) {
    const result = await query(
        `INSERT INTO medical_records (patient_id, doctor_id, diagnosis, prescription)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [recordData.patient_id, recordData.doctor_id, recordData.diagnosis, recordData.prescription]
    );
    return result.rows[0];
}

export async function getPatientMedicalRecords(patientId: number) {
    const result = await query(
        `SELECT mr.*, d.first_name as doctor_first_name, d.last_name as doctor_last_name
         FROM medical_records mr
         JOIN doctors d ON mr.doctor_id = d.doctor_id
         WHERE mr.patient_id = $1
         ORDER BY mr.visit_date DESC`,
        [patientId]
    );
    return result.rows;
}

// Medication Operations
export async function createMedication(medicationData: {
    name: string;
    description?: string;
    dosage?: string;
}) {
    const result = await query(
        `INSERT INTO medications (name, description, dosage)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [medicationData.name, medicationData.description, medicationData.dosage]
    );
    return result.rows[0];
}

// Prescription Medication Operations
export async function addPrescriptionMedication(prescriptionData: {
    record_id: number;
    medication_id: number;
    dosage: string;
    frequency: string;
    duration: string;
}) {
    const result = await query(
        `INSERT INTO prescription_medications (record_id, medication_id, dosage, frequency, duration)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [prescriptionData.record_id, prescriptionData.medication_id, 
         prescriptionData.dosage, prescriptionData.frequency, prescriptionData.duration]
    );
    return result.rows[0];
} 