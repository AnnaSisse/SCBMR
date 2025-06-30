import { query } from './queries';
import { encryptAES256, decryptAES256 } from '../utils';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from './config';

// Patient Operations
export async function createPatient(patientData: {
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    gender?: string;
    phone_number?: string;
    email?: string;
    address?: string;
    blood_type?: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    allergies?: string;
    medical_history?: string;
    insurance?: string;
}) {
    try {
        console.log('Creating patient with data:', patientData);
        
        // Use pool directly to get insertId
        const [result] = await pool.query(
            `INSERT INTO patients (first_name, last_name, date_of_birth, gender, phone_number, email, address, blood_type, emergency_contact_name, emergency_contact_phone, allergies, medical_history, insurance)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [patientData.first_name, patientData.last_name, patientData.date_of_birth, 
             patientData.gender, patientData.phone_number, patientData.email, patientData.address,
             patientData.blood_type, patientData.emergency_contact_name, patientData.emergency_contact_phone, patientData.allergies, patientData.medical_history, patientData.insurance]
        );
        
        console.log('Patient inserted with ID:', result.insertId);
        
    // Get the inserted patient
        const rows = await query('SELECT * FROM patients WHERE patient_id = ?', [result.insertId]);
        const patient = rows[0];
        
        console.log('Retrieved patient:', patient);
    return patient;
    } catch (error) {
        console.error('Error in createPatient function:', error);
        throw error;
    }
}

export async function getPatient(patientId: number) {
    const [rows] = await query(
        'SELECT * FROM patients WHERE patient_id = ?',
        [patientId]
    ) as [RowDataPacket[], unknown];
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
    ) as [ResultSetHeader, unknown];
    const [[doctor]] = await query('SELECT * FROM doctors WHERE doctor_id = ?', [result.insertId]) as [RowDataPacket[][], unknown];
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
    } catch (error: unknown) {
        if (error instanceof Error && error.message === 'ER_DUP_ENTRY') {
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
    ) as [RowDataPacket[], unknown];
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
    ) as [ResultSetHeader, unknown];
    const [[appointment]] = await query('SELECT * FROM appointments WHERE appointment_id = ?', [result.insertId]) as [RowDataPacket[][], unknown];
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
    ) as [RowDataPacket[], unknown];
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
    ) as [ResultSetHeader, unknown];
    const [[record]] = await query('SELECT * FROM medical_records WHERE record_id = ?', [result.insertId]) as [RowDataPacket[][], unknown];
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
    ) as [RowDataPacket[], unknown];
    // Decrypt sensitive fields
    const records = rows.map((row: any) => ({
        ...row,
        diagnosis: row.diagnosis ? decryptAES256(row.diagnosis) : null,
        prescription: row.prescription ? decryptAES256(row.prescription) : null,
    }));
    return records;
}

// Examination Operations
export async function createExamination(examinationData: {
    patient_id: number;
    doctor_id: number;
    examination_type: string;
    findings?: string;
    recommendations?: string;
    notes?: string;
}) {
    try {
        console.log('Creating examination with data:', examinationData);
        
        const [result] = await query(
            `INSERT INTO examinations (patient_id, doctor_id, examination_type, findings, recommendations, notes)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [examinationData.patient_id, examinationData.doctor_id, examinationData.examination_type,
             examinationData.findings, examinationData.recommendations, examinationData.notes]
        ) as [ResultSetHeader, unknown];
        
        console.log('Examination inserted with ID:', result.insertId);
        
        // Get the inserted examination with doctor info
        const rows = await query(
            `SELECT e.*, d.first_name as doctor_first_name, d.last_name as doctor_last_name
             FROM examinations e
             JOIN doctors d ON e.doctor_id = d.doctor_id
             WHERE e.examination_id = ?`,
            [result.insertId]
        );
        const examination = rows[0];
        
        console.log('Retrieved examination:', examination);
        return examination;
    } catch (error) {
        console.error('Error in createExamination function:', error);
        throw error;
    }
}

export async function getAllExaminations() {
    const rows = await query(
        `SELECT e.*, d.first_name as doctor_first_name, d.last_name as doctor_last_name,
                p.first_name as patient_first_name, p.last_name as patient_last_name
         FROM examinations e
         JOIN doctors d ON e.doctor_id = d.doctor_id
         JOIN patients p ON e.patient_id = p.patient_id
         ORDER BY e.examination_date DESC`
    );
    return rows;
}

export async function getExaminationsByPatient(patientId: number) {
    const rows = await query(
        `SELECT e.*, d.first_name as doctor_first_name, d.last_name as doctor_last_name
         FROM examinations e
         JOIN doctors d ON e.doctor_id = d.doctor_id
         WHERE e.patient_id = ?
         ORDER BY e.examination_date DESC`,
        [patientId]
    );
    return rows;
}

export async function getExaminationsByDoctor(doctorId: number) {
    const rows = await query(
        `SELECT e.*, p.first_name as patient_first_name, p.last_name as patient_last_name
         FROM examinations e
         JOIN patients p ON e.patient_id = p.patient_id
         WHERE e.doctor_id = ?
         ORDER BY e.examination_date DESC`,
        [doctorId]
    );
    return rows;
}

export async function getExaminationById(examinationId: number) {
    const [rows] = await query(
        `SELECT e.*, 
                p.first_name as patient_first_name, p.last_name as patient_last_name,
                d.first_name as doctor_first_name, d.last_name as doctor_last_name
         FROM examinations e
         JOIN patients p ON e.patient_id = p.patient_id
         JOIN doctors d ON e.doctor_id = d.doctor_id
         WHERE e.examination_id = ?`,
        [examinationId]
    );
    return rows[0];
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
    ) as [ResultSetHeader, unknown];
    const [[medication]] = await query('SELECT * FROM medications WHERE medication_id = ?', [result.insertId]) as [RowDataPacket[][], unknown];
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
    ) as [ResultSetHeader, unknown];
    const [[prescription]] = await query('SELECT * FROM prescription_medications WHERE prescription_id = ?', [result.insertId]) as [RowDataPacket[][], unknown];
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
    ) as [ResultSetHeader, unknown];
    const [[department]] = await query('SELECT * FROM departments WHERE department_id = ?', [result.insertId]) as [RowDataPacket[][], unknown];
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
    ) as [ResultSetHeader, unknown];
    const [[role]] = await query('SELECT * FROM roles WHERE role_id = ?', [result.insertId]) as [RowDataPacket[][], unknown];
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
    ) as [ResultSetHeader, unknown];
    const [[permission]] = await query('SELECT * FROM permissions WHERE permission_id = ?', [result.insertId]) as [RowDataPacket[][], unknown];
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
    ) as [ResultSetHeader, unknown];
    const [[labResult]] = await query('SELECT * FROM lab_results WHERE result_id = ?', [result.insertId]) as [RowDataPacket[][], unknown];
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
    ) as [ResultSetHeader, unknown];
    const [[notification]] = await query('SELECT * FROM notifications WHERE notification_id = ?', [result.insertId]) as [RowDataPacket[][], unknown];
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
    ) as [ResultSetHeader, unknown];
    const [[bill]] = await query('SELECT * FROM billing WHERE bill_id = ?', [result.insertId]) as [RowDataPacket[][], unknown];
    return bill;
}
export async function getAllBilling() {
    const [rows] = await query('SELECT * FROM billing ORDER BY issued_date DESC') as [RowDataPacket[], unknown];
    return rows;
}

// Medical Images Operations
export async function createMedicalImage(imageData: {
    patient_id: number;
    image_type: string;
    image_url: string;
    description?: string;
    doctor_id?: number;
}) {
    const [result] = await query(
        `INSERT INTO medical_images (patient_id, image_type, image_url, description, doctor_id)
         VALUES (?, ?, ?, ?, ?)`,
        [imageData.patient_id, imageData.image_type, imageData.image_url, 
         imageData.description, imageData.doctor_id]
    ) as [ResultSetHeader, unknown];
    const [[image]] = await query('SELECT * FROM medical_images WHERE image_id = ?', [result.insertId]) as [RowDataPacket[][], unknown];
    return image;
}

export async function getAllMedicalImages() {
    const [rows] = await query(
        `SELECT mi.*, p.first_name as patient_first_name, p.last_name as patient_last_name,
                d.first_name as doctor_first_name, d.last_name as doctor_last_name
         FROM medical_images mi
         LEFT JOIN patients p ON mi.patient_id = p.patient_id
         LEFT JOIN doctors d ON mi.doctor_id = d.doctor_id
         ORDER BY mi.created_at DESC`
    ) as [RowDataPacket[], unknown];
    return rows;
}

// Messages Operations
export async function createMessage(messageData: {
    sender_id: number;
    recipient_id: number;
    message: string;
    message_type?: string;
}) {
    const [result] = await query(
        `INSERT INTO messages (sender_id, recipient_id, message, message_type)
         VALUES (?, ?, ?, ?)`,
        [messageData.sender_id, messageData.recipient_id, messageData.message, 
         messageData.message_type || 'text']
    ) as [ResultSetHeader, unknown];
    const [[message]] = await query('SELECT * FROM messages WHERE message_id = ?', [result.insertId]) as [RowDataPacket[][], unknown];
    return message;
}

export async function getAllMessages() {
    const [rows] = await query(
        `SELECT m.*, 
                s.first_name as sender_first_name, s.last_name as sender_last_name,
                r.first_name as recipient_first_name, r.last_name as recipient_last_name
         FROM messages m
         LEFT JOIN users s ON m.sender_id = s.user_id
         LEFT JOIN users r ON m.recipient_id = r.user_id
         ORDER BY m.created_at DESC`
    ) as [RowDataPacket[], unknown];
    return rows;
}

// Orders Operations
export async function createOrder(orderData: {
    patient_id: number;
    doctor_id: number;
    order_type: string;
    status?: string;
    notes?: string;
}) {
    const [result] = await query(
        `INSERT INTO orders (patient_id, doctor_id, order_type, status, notes)
         VALUES (?, ?, ?, ?, ?)`,
        [orderData.patient_id, orderData.doctor_id, orderData.order_type,
         orderData.status || 'pending', orderData.notes]
    ) as [ResultSetHeader, unknown];
    const [[order]] = await query('SELECT * FROM orders WHERE order_id = ?', [result.insertId]) as [RowDataPacket[][], unknown];
    return order;
}

export async function getAllOrders() {
    const [rows] = await query(
        `SELECT o.*, 
                p.first_name as patient_first_name, p.last_name as patient_last_name,
                d.first_name as doctor_first_name, d.last_name as doctor_last_name
         FROM orders o
         LEFT JOIN patients p ON o.patient_id = p.patient_id
         LEFT JOIN doctors d ON o.doctor_id = d.doctor_id
         ORDER BY o.created_at DESC`
    ) as [RowDataPacket[], unknown];
    return rows;
}

// Referrals Operations
export async function createReferral(referralData: {
    patient_id: number;
    referring_doctor_id: number;
    referred_doctor_id: number;
    reason: string;
    status?: string;
}) {
    const [result] = await query(
        `INSERT INTO referrals (patient_id, referring_doctor_id, referred_doctor_id, reason, status)
         VALUES (?, ?, ?, ?, ?)`,
        [referralData.patient_id, referralData.referring_doctor_id, referralData.referred_doctor_id,
         referralData.reason, referralData.status || 'pending']
    ) as [ResultSetHeader, unknown];
    const [[referral]] = await query('SELECT * FROM referrals WHERE referral_id = ?', [result.insertId]) as [RowDataPacket[][], unknown];
    return referral;
}

export async function getAllReferrals() {
    const [rows] = await query(
        `SELECT r.*, 
                p.first_name as patient_first_name, p.last_name as patient_last_name,
                rd.first_name as referring_doctor_first_name, rd.last_name as referring_doctor_last_name,
                red.first_name as referred_doctor_first_name, red.last_name as referred_doctor_last_name
         FROM referrals r
         LEFT JOIN patients p ON r.patient_id = p.patient_id
         LEFT JOIN doctors rd ON r.referring_doctor_id = rd.doctor_id
         LEFT JOIN doctors red ON r.referred_doctor_id = red.doctor_id
         ORDER BY r.created_at DESC`
    ) as [RowDataPacket[], unknown];
    return rows;
}

// Tasks Operations
export async function getAllTasks() {
    const [rows] = await query(
        `SELECT t.*, 
                a.first_name as assigned_to_first_name, a.last_name as assigned_to_last_name,
                c.first_name as created_by_first_name, c.last_name as created_by_last_name
         FROM tasks t
         LEFT JOIN users a ON t.assigned_to = a.user_id
         LEFT JOIN users c ON t.created_by = c.user_id
         ORDER BY t.created_at DESC`
    ) as [RowDataPacket[], unknown];
    return rows;
}

export async function createTask(taskData: {
    title: string;
    description?: string;
    assigned_to?: number;
    created_by: number;
    priority?: string;
    status?: string;
    due_date?: Date;
}) {
    const [result] = await query(
        `INSERT INTO tasks (title, description, assigned_to, created_by, priority, status, due_date)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [taskData.title, taskData.description, taskData.assigned_to, taskData.created_by,
         taskData.priority || 'medium', taskData.status || 'pending', taskData.due_date]
    ) as [ResultSetHeader, unknown];
    const [[task]] = await query('SELECT * FROM tasks WHERE task_id = ?', [result.insertId]) as [RowDataPacket[][], unknown];
    return task;
}

// Hospitalisation Operations
export async function createHospitalisation(hospitalisationData: {
    patient_id: number;
    doctor_id: number;
    admission_date: Date;
    ward: string;
    room: string;
    reason: string;
    status?: string;
    discharge_date?: Date;
    notes?: string;
}) {
    // Defensive checks for required fields
    if (!hospitalisationData.patient_id || isNaN(Number(hospitalisationData.patient_id))) {
        throw new Error('Invalid or missing patient_id');
    }
    if (!hospitalisationData.doctor_id || isNaN(Number(hospitalisationData.doctor_id))) {
        throw new Error('Invalid or missing doctor_id');
    }
    if (!hospitalisationData.admission_date) {
        throw new Error('Missing admission_date');
    }
    if (!hospitalisationData.reason) {
        throw new Error('Missing reason for hospitalisation');
    }
    if (!hospitalisationData.ward) {
        throw new Error('Missing ward');
    }
    if (!hospitalisationData.room) {
        throw new Error('Missing room');
    }
    const [result] = await query(
        `INSERT INTO hospitalisations (patient_id, doctor_id, admission_date, ward, room, reason, status, discharge_date, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [hospitalisationData.patient_id, hospitalisationData.doctor_id, hospitalisationData.admission_date,
         hospitalisationData.ward, hospitalisationData.room, hospitalisationData.reason,
         hospitalisationData.status || 'admitted', hospitalisationData.discharge_date, hospitalisationData.notes]
    ) as [ResultSetHeader, unknown];
    const [[hospitalisation]] = await query('SELECT * FROM hospitalisations WHERE hospitalisation_id = ?', [result.insertId]) as [RowDataPacket[][], unknown];
    return hospitalisation;
}

export async function getAllHospitalisations() {
    const [rows] = await query(
        `SELECT h.*, 
                p.first_name as patient_first_name, p.last_name as patient_last_name,
                d.first_name as doctor_first_name, d.last_name as doctor_last_name
         FROM hospitalisations h
         LEFT JOIN patients p ON h.patient_id = p.patient_id
         LEFT JOIN doctors d ON h.doctor_id = d.doctor_id
         ORDER BY h.admission_date DESC`
    ) as [RowDataPacket[], unknown];
    return rows;
}

export async function getHospitalisationsByDoctor(doctorId: number) {
    const [rows] = await query(
        `SELECT h.*, 
                p.first_name as patient_first_name, p.last_name as patient_last_name
         FROM hospitalisations h
         LEFT JOIN patients p ON h.patient_id = p.patient_id
         WHERE h.doctor_id = ?
         ORDER BY h.admission_date DESC`,
        [doctorId]
    ) as [RowDataPacket[], unknown];
    return rows;
}

export async function getHospitalisationsByPatient(patientId: number) {
    const rows = await query(
        `SELECT h.*, p.first_name as patient_first_name, p.last_name as patient_last_name
         FROM hospitalisations h
         JOIN patients p ON h.patient_id = p.patient_id
         WHERE h.patient_id = ?
         ORDER BY h.admission_date DESC`,
        [patientId]
    );
    return rows;
}

export async function getHospitalisationById(hospitalisationId: number) {
    const [rows] = await query(
        `SELECT h.*, 
                p.first_name as patient_first_name, p.last_name as patient_last_name,
                d.first_name as doctor_first_name, d.last_name as doctor_last_name
         FROM hospitalisations h
         JOIN patients p ON h.patient_id = p.patient_id
         JOIN doctors d ON h.doctor_id = d.doctor_id
         WHERE h.hospitalisation_id = ?`,
        [hospitalisationId]
    );
    return rows[0];
}

export async function updateHospitalisationDischarge(hospitalisationId: number, dischargeDate: Date, notes?: string) {
    const [result] = await query(
        `UPDATE hospitalisations 
         SET discharge_date = ?, status = 'discharged', notes = ?
         WHERE hospitalisation_id = ?`,
        [dischargeDate, notes, hospitalisationId]
    ) as [ResultSetHeader, unknown];
    const [[hospitalisation]] = await query('SELECT * FROM hospitalisations WHERE hospitalisation_id = ?', [hospitalisationId]) as [RowDataPacket[][], unknown];
    return hospitalisation;
} 