import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create test users
  const adminPassword = await bcrypt.hash('admin123', 12);
  const doctorPassword = await bcrypt.hash('doctor123', 12);
  const patientPassword = await bcrypt.hash('patient123', 12);
  const now = new Date();

  const admin = await prisma.user.upsert({
    where: { email: 'admin@hospital.com' },
    update: {},
    create: {
      id: 'admin-1',
      email: 'admin@hospital.com',
      name: 'System Administrator',
      password: adminPassword,
      role: Role.ADMIN,
      createdAt: now,
      updatedAt: now,
    },
  });

  const doctor = await prisma.user.upsert({
    where: { email: 'doctor@hospital.com' },
    update: {},
    create: {
      id: 'doctor-1',
      email: 'doctor@hospital.com',
      name: 'Dr. Sarah Johnson',
      password: doctorPassword,
      role: Role.DOCTOR,
      createdAt: now,
      updatedAt: now,
    },
  });

  const patient = await prisma.user.upsert({
    where: { email: 'patient@hospital.com' },
    update: {},
    create: {
      id: 'patient-1',
      email: 'patient@hospital.com',
      name: 'John Patient',
      password: patientPassword,
      role: Role.PATIENT,
      createdAt: now,
      updatedAt: now,
    },
  });

  console.log({ admin, doctor, patient });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 