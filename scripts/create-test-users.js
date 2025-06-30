const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function createTestUsers() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'scbmr_db'
    });

    console.log('🔧 Creating test users...');

    // Hash passwords
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create test users
    const testUsers = [
      {
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'admin'
      },
      {
        first_name: 'Doctor',
        last_name: 'Smith',
        email: 'doctor@test.com',
        password: hashedPassword,
        role: 'doctor'
      },
      {
        first_name: 'Patient',
        last_name: 'Johnson',
        email: 'patient@test.com',
        password: hashedPassword,
        role: 'patient'
      },
      {
        first_name: 'Nurse',
        last_name: 'Wilson',
        email: 'nurse@test.com',
        password: hashedPassword,
        role: 'nurse'
      }
    ];

    for (const user of testUsers) {
      // Check if user already exists
      const [existing] = await connection.execute(
        'SELECT * FROM users WHERE email = ?',
        [user.email]
      );

      if (existing.length === 0) {
        await connection.execute(
          'INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)',
          [user.first_name, user.last_name, user.email, user.password, user.role]
        );
        console.log(`✅ Created user: ${user.email} (${user.role})`);
      } else {
        console.log(`⚠️  User already exists: ${user.email}`);
      }
    }

    console.log('\n📋 Test Users Created:');
    console.log('Email: admin@test.com, Password: password123, Role: Admin');
    console.log('Email: doctor@test.com, Password: password123, Role: Doctor');
    console.log('Email: patient@test.com, Password: password123, Role: Patient');
    console.log('Email: nurse@test.com, Password: password123, Role: Nurse');

  } catch (error) {
    console.error('❌ Error creating test users:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Load environment variables
require('dotenv').config();

// Run the script
createTestUsers(); 