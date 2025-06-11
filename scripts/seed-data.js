// Seed initial data for the medical system
console.log("Seeding initial data for Medical Record Management System...")

// Create demo users
const demoUsers = [
  {
    id: "1",
    name: "System Administrator",
    email: "admin@hospital.com",
    password: "admin123",
    role: "Admin",
    phone: "+1-555-0001",
    department: "Administration",
    createdAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: "2",
    name: "Dr. Sarah Johnson",
    email: "doctor@hospital.com",
    password: "doctor123",
    role: "Doctor",
    phone: "+1-555-0002",
    department: "Cardiology",
    createdAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: "3",
    name: "John Patient",
    email: "patient@hospital.com",
    password: "patient123",
    role: "Patient",
    phone: "+1-555-0003",
    department: "",
    createdAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: "4",
    name: "Nurse Mary Wilson",
    email: "nurse@hospital.com",
    password: "nurse123",
    role: "Nurse",
    phone: "+1-555-0004",
    department: "Emergency",
    createdAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: "5",
    name: "Lab Tech Mike Davis",
    email: "lab@hospital.com",
    password: "lab123",
    role: "Lab Technician",
    phone: "+1-555-0005",
    department: "Laboratory",
    createdAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: "6",
    name: "Receptionist Lisa Brown",
    email: "reception@hospital.com",
    password: "reception123",
    role: "Receptionist",
    phone: "+1-555-0006",
    department: "Front Desk",
    createdAt: new Date().toISOString(),
    isActive: true,
  },
]

// Create demo patients
const demoPatients = [
  {
    id: "p1",
    patientId: "P000001",
    name: "John Patient",
    email: "patient@hospital.com",
    phone: "+1-555-0003",
    dateOfBirth: "1985-06-15",
    age: 38,
    gender: "Male",
    address: "123 Main St, City, State 12345",
    emergencyContact: "Jane Patient",
    emergencyPhone: "+1-555-0007",
    bloodType: "O+",
    allergies: "Penicillin, Shellfish",
    medicalHistory: "Hypertension, Type 2 Diabetes",
    insurance: "Blue Cross Blue Shield - Policy #12345",
    status: "Active",
    createdAt: new Date().toISOString(),
    lastVisit: new Date().toISOString(),
    medicalRecords: [],
  },
  {
    id: "p2",
    patientId: "P000002",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "+1-555-0008",
    dateOfBirth: "1992-03-22",
    age: 31,
    gender: "Female",
    address: "456 Oak Ave, City, State 12345",
    emergencyContact: "Robert Davis",
    emergencyPhone: "+1-555-0009",
    bloodType: "A-",
    allergies: "None known",
    medicalHistory: "Asthma",
    insurance: "Aetna - Policy #67890",
    status: "Active",
    createdAt: new Date().toISOString(),
    lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    medicalRecords: [],
  },
]

// Create demo appointments
const demoAppointments = [
  {
    id: "a1",
    patientId: "p1",
    doctorId: "2",
    patientName: "John Patient",
    doctorName: "Dr. Sarah Johnson",
    date: new Date().toISOString(),
    time: "10:00",
    type: "Follow-up",
    status: "Scheduled",
    notes: "Regular diabetes check-up",
    createdAt: new Date().toISOString(),
  },
  {
    id: "a2",
    patientId: "p2",
    doctorId: "2",
    patientName: "Emily Davis",
    doctorName: "Dr. Sarah Johnson",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    time: "14:30",
    type: "Consultation",
    status: "Scheduled",
    notes: "Asthma management consultation",
    createdAt: new Date().toISOString(),
  },
]

// Store data in localStorage (simulating database)
if (typeof localStorage !== "undefined") {
  localStorage.setItem("users", JSON.stringify([]))
  localStorage.setItem("patients", JSON.stringify([]))
  localStorage.setItem("appointments", JSON.stringify([]))
  localStorage.setItem("deathCertificates", JSON.stringify([]))

  console.log("✅ System initialized successfully!")
} else {
  console.log("localStorage not available - data seeding skipped")
}
