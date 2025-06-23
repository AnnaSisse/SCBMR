# Database Setup Guide

This guide will help you set up the database for the Hospital Management System.

## Prerequisites

1. **MySQL Server** (version 5.7 or higher)
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or use XAMPP/WAMP for Windows
   - Or use Docker: `docker run --name mysql -e MYSQL_ROOT_PASSWORD=your_password -p 3306:3306 -d mysql:8.0`

2. **Node.js** (version 16 or higher)
   - Download from: https://nodejs.org/

## Step 1: Environment Configuration

1. Copy the environment template:
   ```bash
   cp env-template.txt .env.local
   ```

2. Edit `.env.local` with your database credentials:
   ```env
   # Database Configuration
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=your_mysql_password
   MYSQL_DATABASE=hospital_db
   MYSQL_PORT=3306

   # Encryption Key (32-byte hex string for AES-256)
   # Generate one with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   AES_SECRET_KEY=your_32_byte_hex_encryption_key_here

   # Next.js Configuration
   NEXTAUTH_SECRET=your_nextauth_secret_here
   NEXTAUTH_URL=http://localhost:3000
   ```

3. Generate an encryption key:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Copy the output and replace `your_32_byte_hex_encryption_key_here` in `.env.local`

## Step 2: Database Initialization

### Option A: Fresh Setup (Recommended)
```bash
npm run db:init
```

This will:
- Create the database if it doesn't exist
- Apply the complete schema
- Seed with initial data
- Create default users

### Option B: Reset and Reinitialize
```bash
npm run db:reset
npm run db:init
```

### Option C: Check Connection Only
```bash
npm run db:check
```

## Step 3: Verify Setup

After initialization, you should see output like:
```
✅ Database initialization completed successfully!

📝 Next steps:
1. Set up your environment variables in .env.local
2. Run: npm run dev
3. Test the application with the provided credentials

🔑 Default login credentials:
Admin: admin@hospital.com / admin123
Doctor: doctor@hospital.com / doctor123
Nurse: nurse@hospital.com / nurse123
```

## Step 4: Start the Application

```bash
npm run dev
```

Visit http://localhost:3000 and test the login with the provided credentials.

## Database Schema

The system creates the following tables:

- **users** - System users with roles
- **patients** - Patient information
- **doctors** - Doctor information
- **appointments** - Appointment scheduling
- **medical_records** - Encrypted medical records
- **medications** - Available medications
- **prescription_medications** - Medication prescriptions
- **audit_logs** - System audit trail

## Troubleshooting

### Connection Issues
1. **"Access denied"**: Check your MySQL username and password
2. **"Connection refused"**: Ensure MySQL server is running
3. **"Database doesn't exist"**: Run `npm run db:init`

### Permission Issues
1. **"CREATE DATABASE denied"**: Ensure your MySQL user has CREATE privileges
2. **"INSERT denied"**: Ensure your MySQL user has INSERT privileges

### Common Commands
```bash
# Check MySQL status (Windows)
net start mysql

# Check MySQL status (Linux/Mac)
sudo systemctl status mysql

# Connect to MySQL CLI
mysql -u root -p

# Show databases
SHOW DATABASES;

# Use database
USE hospital_db;

# Show tables
SHOW TABLES;
```

## Security Notes

1. **Never commit `.env.local`** to version control
2. **Use strong passwords** for production
3. **Enable SSL** for production database connections
4. **Regular backups** of your database
5. **Monitor audit logs** for suspicious activity

## Production Deployment

For production, consider:
1. Using a managed database service (AWS RDS, Google Cloud SQL, etc.)
2. Setting up automated backups
3. Configuring SSL connections
4. Using environment-specific configuration
5. Setting up monitoring and alerting

## Support

If you encounter issues:
1. Check the console output for error messages
2. Verify your MySQL server is running
3. Confirm your environment variables are correct
4. Check the troubleshooting section above 