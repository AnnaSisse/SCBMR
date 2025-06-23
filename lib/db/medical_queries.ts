import { query } from './queries';
import { encryptAES256, decryptAES256 } from '../utils';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

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
    const [result] = await query(
        `INSERT INTO patients (first_name, last_name, date_of_birth, gender, phone_number, email, address)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [patientData.first_name, patientData.last_name, patientData.date_of_birth, 
         patientData.gender, patientData.phone_number, patientData.email, patientData.address]
    ) as [ResultSetHeader, any];
    // Get the inserted patient
    const [[patient]] = await query('SELECT * FROM patients WHERE patient_id = ?', [result.insertId]) as [RowDataPacket[][], any];
    return patient;
}

export async function getPatient(patientId: number) {
    const [rows] = await query(
        'SELECT * FROM patients WHERE patient_id = ?',
        [patientId]
    ) as [RowDataPacket[], any];
    return rows[0];
}

// Doctor Operations
export async function createDoctor(doctorData: {
    first_name: string;
    last_name: string;
    specialization?: string;
    phone_number?: string;
    email?: string;
}) {
    const [result] = await query(
        `INSERT INTO doctors (first_name, last_name, specialization, phone_number, email)
         VALUES (?, ?, ?, ?, ?)`,
        [doctorData.first_name, doctorData.last_name, doctorData.specialization,
         doctorData.phone_number, doctorData.email]
    ) as [ResultSetHeader, any];
    const [[doctor]] = await query('SELECT * FROM doctors WHERE doctor_id = ?', [result.insertId]) as [RowDataPacket[][], any];
    return doctor;
}

// User Operations
export async function createUser(userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role?: string;
    phone?: string;
    department?: string;
}) {
    try {
        const result = await query(
            `INSERT INTO users (first_name, last_name, email, password, role, phone, department)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userData.first_name, userData.last_name, userData.email, userData.password, userData.role, userData.phone, userData.department]
        );
        const users = await query('SELECT * FROM users WHERE user_id = ?', [result.insertId]);
        return users[0];
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error('DUPLICATE_EMAIL');
        }
        throw error;
    }
}

export async function findUserByCredentials(credentials: { email: string; password: string; role: string; }) {
    const { email, password, role } = credentials;
    const [rows] = await query(
        'SELECT * FROM users WHERE email = ? AND password = ? AND role = ?',
        [email, password, role]
    ) as [RowDataPacket[], any];
    return rows[0];
}

// Appointment Operations
export async function createAppointment(appointmentData: {
    patient_id: number;
    doctor_id: number;
    appointment_date: Date;
    status?: string;
    notes?: string;
}) {
    const [result] = await query(
        `INSERT INTO appointments (patient_id, doctor_id, appointment_date, status, notes)
         VALUES (?, ?, ?, ?, ?)`,
        [appointmentData.patient_id, appointmentData.doctor_id, appointmentData.appointment_date,
         appointmentData.status || 'scheduled', appointmentData.notes]
    ) as [ResultSetHeader, any];
    const [[appointment]] = await query('SELECT * FROM appointments WHERE appointment_id = ?', [result.insertId]) as [RowDataPacket[][], any];
    return appointment;
}

export async function getPatientAppointments(patientId: number) {
    const [rows] = await query(
        `SELECT a.*, d.first_name as doctor_first_name, d.last_name as doctor_last_name
         FROM appointments a
         JOIN doctors d ON a.doctor_id = d.doctor_id
         WHERE a.patient_id = ?
         ORDER BY a.appointment_date DESC`,
        [patientId]
    ) as [RowDataPacket[], any];
    return rows;
}

// Medical Record Operations
export async function createMedicalRecord(recordData: {
    patient_id: number;
    doctor_id: number;
    diagnosis: string;
    prescription?: string;
}) {
    const encryptedDiagnosis = encryptAES256(recordData.diagnosis);
    const encryptedPrescription = recordData.prescription ? encryptAES256(recordData.prescription) : null;
    const [result] = await query(
        `INSERT INTO medical_records (patient_id, doctor_id, diagnosis, prescription)
         VALUES (?, ?, ?, ?)`,
        [recordData.patient_id, recordData.doctor_id, encryptedDiagnosis, encryptedPrescription]
    ) as [ResultSetHeader, any];
    const [[record]] = await query('SELECT * FROM medical_records WHERE record_id = ?', [result.insertId]) as [RowDataPacket[][], any];
    return record;
}

export async function getPatientMedicalRecords(patientId: number) {
    const [rows] = await query(
        `SELECT mr.*, d.first_name as doctor_first_name, d.last_name as doctor_last_name
         FROM medical_records mr
         JOIN doctors d ON mr.doctor_id = d.doctor_id
         WHERE mr.patient_id = ?
         ORDER BY mr.visit_date DESC`,
        [patientId]
    ) as [RowDataPacket[], any];
    // Decrypt sensitive fields
    const records = rows.map((row: any) => ({
        ...row,
        diagnosis: row.diagnosis ? decryptAES256(row.diagnosis) : null,
        prescription: row.prescription ? decryptAES256(row.prescription) : null,
    }));
    return records;
}

// Medication Operations
export async function createMedication(medicationData: {
    name: string;
    description?: string;
    dosage?: string;
}) {
    const [result] = await query(
        `INSERT INTO medications (name, description, dosage)
         VALUES (?, ?, ?)`,
        [medicationData.name, medicationData.description, medicationData.dosage]
    ) as [ResultSetHeader, any];
    const [[medication]] = await query('SELECT * FROM medications WHERE medication_id = ?', [result.insertId]) as [RowDataPacket[][], any];
    return medication;
}

// Prescription Medication Operations
export async function addPrescriptionMedication(prescriptionData: {
    record_id: number;
    medication_id: number;
    dosage: string;
    frequency: string;
    duration: string;
}) {
    const [result] = await query(
        `INSERT INTO prescription_medications (record_id, medication_id, dosage, frequency, duration)
         VALUES (?, ?, ?, ?, ?)`,
        [prescriptionData.record_id, prescriptionData.medication_id, 
         prescriptionData.dosage, prescriptionData.frequency, prescriptionData.duration]
    ) as [ResultSetHeader, any];
    const [[prescription]] = await query('SELECT * FROM prescription_medications WHERE prescription_id = ?', [result.insertId]) as [RowDataPacket[][], any];
    return prescription;
}

export async function logAudit({
    user_id,
    action,
    resource,
    resource_id,
    details,
    ip_address
}: {
    user_id: number,
    action: string,
    resource: string,
    resource_id?: number,
    details?: string,
    ip_address?: string
}) {
    await query(
        `INSERT INTO audit_logs (user_id, action, resource, resource_id, details, ip_address)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [user_id, action, resource, resource_id || null, details || null, ip_address || null]
    );
}

// Department Operations
export async function createDepartment(departmentData: { name: string; description?: string }) {
    const [result] = await query(
        `INSERT INTO departments (name, description) VALUES (?, ?)`,
        [departmentData.name, departmentData.description || null]
    ) as [ResultSetHeader, any];
    const [[department]] = await query('SELECT * FROM departments WHERE department_id = ?', [result.insertId]) as [RowDataPacket[][], any];
    return department;
}
export async function getAllDepartments() {
    return await query('SELECT * FROM departments');
}

// Role Operations
export async function createRole(roleData: { role_name: string; description?: string }) {
    const [result] = await query(
        `INSERT INTO roles (role_name, description) VALUES (?, ?)`,
        [roleData.role_name, roleData.description || null]
    ) as [ResultSetHeader, any];
    const [[role]] = await query('SELECT * FROM roles WHERE role_id = ?', [result.insertId]) as [RowDataPacket[][], any];
    return role;
}
export async function getAllRoles() {
    return await query('SELECT * FROM roles');
}

// Permission Operations
export async function createPermission(permissionData: { permission_name: string; description?: string }) {
    const [result] = await query(
        `INSERT INTO permissions (permission_name, description) VALUES (?, ?)`,
        [permissionData.permission_name, permissionData.description || null]
    ) as [ResultSetHeader, any];
    const [[permission]] = await query('SELECT * FROM permissions WHERE permission_id = ?', [result.insertId]) as [RowDataPacket[][], any];
    return permission;
}
export async function getAllPermissions() {
    return await query('SELECT * FROM permissions');
}

// UserRole Operations
export async function addUserRole(userRoleData: { user_id: number; role_id: number }) {
    await query(
        `INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)`,
        [userRoleData.user_id, userRoleData.role_id]
    );
    return { success: true };
}
export async function getAllUserRoles() {
    return await query('SELECT * FROM user_roles');
}

// RolePermission Operations
export async function addRolePermission(rolePermissionData: { role_id: number; permission_id: number }) {
    await query(
        `INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)`,
        [rolePermissionData.role_id, rolePermissionData.permission_id]
    );
    return { success: true };
}
export async function getAllRolePermissions() {
    return await query('SELECT * FROM role_permissions');
}

// LabResult Operations
export async function createLabResult(labResultData: { patient_id: number; test_name: string; result_value?: string; result_date?: string; doctor_id?: number; notes?: string }) {
    const [result] = await query(
        `INSERT INTO lab_results (patient_id, test_name, result_value, result_date, doctor_id, notes) VALUES (?, ?, ?, ?, ?, ?)`,
        [labResultData.patient_id, labResultData.test_name, labResultData.result_value || null, labResultData.result_date || null, labResultData.doctor_id || null, labResultData.notes || null]
    ) as [ResultSetHeader, any];
    const [[labResult]] = await query('SELECT * FROM lab_results WHERE result_id = ?', [result.insertId]) as [RowDataPacket[][], any];
    return labResult;
}
export async function getAllLabResults() {
    return await query('SELECT * FROM lab_results');
}

// Notification Operations
export async function createNotification(notificationData: { user_id: number; message: string; is_read?: boolean }) {
    const [result] = await query(
        `INSERT INTO notifications (user_id, message, is_read) VALUES (?, ?, ?)`,
        [notificationData.user_id, notificationData.message, notificationData.is_read ?? false]
    ) as [ResultSetHeader, any];
    const [[notification]] = await query('SELECT * FROM notifications WHERE notification_id = ?', [result.insertId]) as [RowDataPacket[][], any];
    return notification;
}
export async function getAllNotifications() {
    return await query('SELECT * FROM notifications');
}

// Billing Operations
export async function createBilling(billingData: { patient_id: number; amount: number; status?: string; issued_date?: string; due_date?: string; description?: string }) {
    const [result] = await query(
        `INSERT INTO billing (patient_id, amount, status, issued_date, due_date, description) VALUES (?, ?, ?, ?, ?, ?)`,
        [billingData.patient_id, billingData.amount, billingData.status || null, billingData.issued_date || null, billingData.due_date || null, billingData.description || null]
    ) as [ResultSetHeader, any];
    const [[bill]] = await query('SELECT * FROM billing WHERE bill_id = ?', [result.insertId]) as [RowDataPacket[][], any];
    return bill;
}
export async function getAllBilling() {
    return await query('SELECT * FROM billing');
} 