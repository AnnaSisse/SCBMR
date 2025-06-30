# Class Diagram - Medical Record Management System

```mermaid
classDiagram
    %% User Management Classes
    class User {
        +user_id: int
        +first_name: string
        +last_name: string
        +email: string
        +password: string
        +role: string
        +phone: string
        +department: string
        +is_active: boolean
        +created_at: timestamp
        +mfa_secret: string
        +login()
        +logout()
        +updateProfile()
    }

    class Patient {
        +patient_id: int
        +first_name: string
        +last_name: string
        +date_of_birth: date
        +gender: string
        +phone_number: string
        +email: string
        +address: text
        +created_at: timestamp
        +getMedicalHistory()
        +getAppointments()
        +getPrescriptions()
    }

    class Doctor {
        +doctor_id: int
        +first_name: string
        +last_name: string
        +specialization: string
        +phone_number: string
        +email: string
        +created_at: timestamp
        +getPatients()
        +createMedicalRecord()
        +createPrescription()
    }

    %% Medical Records Classes
    class MedicalRecord {
        +record_id: int
        +patient_id: int
        +doctor_id: int
        +diagnosis: text
        +prescription: text
        +visit_date: timestamp
        +created_at: timestamp
        +createRecord()
        +updateRecord()
        +getPatientRecords()
    }

    class Appointment {
        +appointment_id: int
        +patient_id: int
        +doctor_id: int
        +appointment_date: timestamp
        +status: string
        +notes: text
        +created_at: timestamp
        +scheduleAppointment()
        +cancelAppointment()
        +updateStatus()
    }

    class Hospitalisation {
        +hospitalisation_id: int
        +patient_id: int
        +doctor_id: int
        +admission_date: date
        +discharge_date: date
        +ward: string
        +room: string
        +reason: text
        +status: string
        +notes: text
        +created_at: timestamp
        +admitPatient()
        +dischargePatient()
        +updateStatus()
    }

    class Examination {
        +examination_id: int
        +patient_id: int
        +doctor_id: int
        +date: date
        +type: string
        +result: text
        +notes: text
        +created_at: timestamp
        +createExamination()
        +updateResult()
        +getPatientExaminations()
    }

    class Prescription {
        +prescription_id: int
        +record_id: int
        +medication_id: int
        +dosage: string
        +frequency: string
        +duration: string
        +created_at: timestamp
        +createPrescription()
        +updatePrescription()
        +getPatientPrescriptions()
    }

    class Medication {
        +medication_id: int
        +name: string
        +description: text
        +dosage: string
        +created_at: timestamp
        +addMedication()
        +updateMedication()
        +getMedications()
    }

    %% Lab and Results Classes
    class LabResult {
        +result_id: int
        +patient_id: int
        +test_name: string
        +result_value: string
        +result_date: date
        +doctor_id: int
        +notes: text
        +createLabResult()
        +updateResult()
        +getPatientResults()
    }

    %% Administrative Classes
    class Billing {
        +bill_id: int
        +patient_id: int
        +amount: decimal
        +status: string
        +issued_date: date
        +due_date: date
        +description: text
        +createBill()
        +updateStatus()
        +getPatientBills()
    }

    class Certificate {
        +certificate_id: int
        +patient_id: int
        +type: string
        +status: string
        +issued_date: date
        +approved_by: int
        +created_at: timestamp
        +createCertificate()
        +approveCertificate()
        +getCertificates()
    }

    class Notification {
        +notification_id: int
        +user_id: int
        +message: text
        +is_read: boolean
        +created_at: timestamp
        +sendNotification()
        +markAsRead()
        +getUserNotifications()
    }

    class AuditLog {
        +log_id: int
        +user_id: int
        +action: string
        +resource: string
        +resource_id: int
        +timestamp: timestamp
        +details: text
        +ip_address: string
        +logAction()
        +getAuditTrail()
    }

    %% Relationships
    User ||--o{ MedicalRecord : creates
    User ||--o{ Appointment : schedules
    User ||--o{ Hospitalisation : manages
    User ||--o{ Examination : conducts
    User ||--o{ LabResult : processes
    User ||--o{ Billing : manages
    User ||--o{ Certificate : approves
    User ||--o{ Notification : receives
    User ||--o{ AuditLog : generates

    Patient ||--o{ MedicalRecord : has
    Patient ||--o{ Appointment : schedules
    Patient ||--o{ Hospitalisation : undergoes
    Patient ||--o{ Examination : receives
    Patient ||--o{ LabResult : has
    Patient ||--o{ Billing : receives
    Patient ||--o{ Certificate : applies

    Doctor ||--o{ MedicalRecord : creates
    Doctor ||--o{ Appointment : conducts
    Doctor ||--o{ Hospitalisation : manages
    Doctor ||--o{ Examination : performs
    Doctor ||--o{ LabResult : orders
    Doctor ||--o{ Prescription : writes

    MedicalRecord ||--o{ Prescription : contains
    Prescription ||--|| Medication : includes
```

## Class Descriptions:

### **Core User Classes**
- **User**: Base user class with authentication and profile management
- **Patient**: Patient-specific information and medical history
- **Doctor**: Medical professional with specialization and patient management

### **Medical Record Classes**
- **MedicalRecord**: Core medical documentation
- **Appointment**: Scheduling and consultation management
- **Hospitalisation**: Inpatient care management
- **Examination**: Medical tests and procedures
- **Prescription**: Medication management
- **Medication**: Drug information and inventory

### **Lab and Results Classes**
- **LabResult**: Laboratory test results and analysis

### **Administrative Classes**
- **Billing**: Financial management and invoicing
- **Certificate**: Legal document processing
- **Notification**: System communication
- **AuditLog**: Security and compliance tracking

### **Key Relationships**
- **One-to-Many**: Users can create multiple records
- **Many-to-One**: Multiple records belong to one patient
- **Many-to-Many**: Doctors and patients through appointments 