import { NextResponse } from 'next/server';
import { createDoctor, createPatient, createAppointment } from '@/lib/db/medical_queries';

// Data copied from scripts/seed-complete-system.js
const doctorsToSeed = [
    {
        first_name: "Sarah",
        last_name: "Johnson",
        specialization: "Cardiology",
        phone_number: "+1-555-0002",
        email: "doctor@hospital.com",
    }
];

const patientsToSeed = [
  {
    first_name: "John",
    last_name: "Patient",
    date_of_birth: new Date("1985-06-15"),
    gender: "Male",
    phone_number: "+1-555-0003",
    email: "patient@hospital.com",
    address: "123 Main St, City, State 12345",
  },
  {
    first_name: "Emily",
    last_name: "Davis",
    date_of_birth: new Date("1992-03-22"),
    gender: "Female",
    phone_number: "+1-555-0008",
    email: "emily.davis@email.com",
    address: "456 Oak Ave, City, State 12345",
  },
  {
    first_name: "Robert",
    last_name: "Wilson",
    date_of_birth: new Date("1975-11-08"),
    gender: "Male",
    phone_number: "+1-555-0010",
    email: "robert.wilson@email.com",
    address: "789 Pine St, City, State 12345",
  }
];

const appointmentsToSeed = [
    {
        appointment_date: new Date(),
        status: 'Scheduled',
        notes: 'Regular diabetes check-up',
    },
    {
        appointment_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: 'Scheduled',
        notes: 'Post-surgery follow-up',
    }
];


export async function GET() {
    try {
        const createdDoctors = [];
        for (const doctor of doctorsToSeed) {
            const newDoctor = await createDoctor(doctor);
            createdDoctors.push(newDoctor);
        }

        const createdPatients = [];
        for (const patient of patientsToSeed) {
            const newPatient = await createPatient(patient);
            createdPatients.push(newPatient);
        }

        for (const appt of appointmentsToSeed) {
            await createAppointment({
                ...appt,
                patient_id: createdPatients[Math.floor(Math.random() * createdPatients.length)].patient_id,
                doctor_id: createdDoctors[0].doctor_id,
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Database seeded successfully with initial medical data.'
        });

    } catch (error) {
        console.error('Error seeding database:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to seed database.',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 