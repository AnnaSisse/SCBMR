# Sequence Diagram - Patient Registration and Medical Record Creation

```mermaid
sequenceDiagram
    participant R as Receptionist
    participant S as System
    participant DB as Database
    participant D as Doctor
    participant P as Patient

    Note over R,P: Patient Registration Flow
    R->>S: Login to System
    S->>DB: Authenticate User
    DB-->>S: Authentication Result
    S-->>R: Access Granted

    R->>S: Create New Patient
    S->>DB: Store Patient Data
    DB-->>S: Patient ID Created
    S-->>R: Patient Created Successfully

    Note over R,P: Appointment Scheduling
    R->>S: Schedule Appointment
    S->>DB: Store Appointment
    DB-->>S: Appointment Confirmed
    S-->>R: Appointment Scheduled

    Note over D,P: Medical Consultation
    D->>S: Login to System
    S->>DB: Authenticate Doctor
    DB-->>S: Authentication Result
    S-->>D: Access Granted

    D->>S: View Patient Records
    S->>DB: Retrieve Patient Data
    DB-->>S: Patient Information
    S-->>D: Display Patient Records

    D->>S: Create Medical Record
    S->>DB: Store Medical Record
    DB-->>S: Record ID Created
    S-->>D: Medical Record Created

    D->>S: Create Prescription
    S->>DB: Store Prescription
    DB-->>S: Prescription ID Created
    S-->>D: Prescription Created

    Note over P: Patient Access
    P->>S: Login to Patient Portal
    S->>DB: Authenticate Patient
    DB-->>S: Authentication Result
    S-->>P: Access Granted

    P->>S: View Medical Records
    S->>DB: Retrieve Patient Records
    DB-->>S: Medical Records
    S-->>P: Display Records

    P->>S: View Prescriptions
    S->>DB: Retrieve Prescriptions
    DB-->>S: Prescription Data
    S-->>P: Display Prescriptions
```

## Key Interactions:

### 1. **Patient Registration**
- Receptionist creates patient account
- System validates and stores data
- Patient ID generated

### 2. **Appointment Scheduling**
- Receptionist schedules appointments
- System manages availability
- Notifications sent

### 3. **Medical Consultation**
- Doctor accesses patient records
- Creates medical records
- Issues prescriptions

### 4. **Patient Access**
- Patient views their records
- Accesses prescriptions
- Downloads documents 