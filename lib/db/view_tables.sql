-- Database Structure Viewer for MySQL Workbench
-- Run this script to see all tables and their details

-- Show all tables in the database
SELECT 'Available Tables:' as info;
SHOW TABLES;

-- Show table status (includes row count and other metadata)
SELECT 'Table Status:' as info;
SHOW TABLE STATUS;

-- Show detailed structure for each table
SELECT 'Patients Table Structure:' as info;
DESCRIBE patients;

SELECT 'Doctors Table Structure:' as info;
DESCRIBE doctors;

SELECT 'Appointments Table Structure:' as info;
DESCRIBE appointments;

SELECT 'Medical Records Table Structure:' as info;
DESCRIBE medical_records;

SELECT 'Medications Table Structure:' as info;
DESCRIBE medications;

SELECT 'Prescription Medications Table Structure:' as info;
DESCRIBE prescription_medications;

SELECT 'Users Table Structure:' as info;
DESCRIBE users;

-- Show foreign key relationships
SELECT 'Foreign Key Relationships:' as info;
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
WHERE REFERENCED_TABLE_SCHEMA = DATABASE()
AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Show row counts for each table
SELECT 'Row Counts:' as info;
SELECT 'patients' as table_name, COUNT(*) as row_count FROM patients
UNION ALL
SELECT 'doctors' as table_name, COUNT(*) as row_count FROM doctors
UNION ALL
SELECT 'appointments' as table_name, COUNT(*) as row_count FROM appointments
UNION ALL
SELECT 'medical_records' as table_name, COUNT(*) as row_count FROM medical_records
UNION ALL
SELECT 'medications' as table_name, COUNT(*) as row_count FROM medications
UNION ALL
SELECT 'prescription_medications' as table_name, COUNT(*) as row_count FROM prescription_medications
UNION ALL
SELECT 'users' as table_name, COUNT(*) as row_count FROM users;

-- Show sample data from each table (first 3 rows)
SELECT 'Sample Data from Patients:' as info;
SELECT * FROM patients LIMIT 3;

SELECT 'Sample Data from Doctors:' as info;
SELECT * FROM doctors LIMIT 3;

SELECT 'Sample Data from Users:' as info;
SELECT * FROM users LIMIT 3; 