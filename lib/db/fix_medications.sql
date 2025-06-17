-- Drop existing medications table if it exists
DROP TABLE IF EXISTS medications CASCADE;

-- Create medications table with the correct schema
CREATE TABLE medications (
    medication_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    dosage VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create prescription_medications table
CREATE TABLE IF NOT EXISTS prescription_medications (
    prescription_id SERIAL PRIMARY KEY,
    record_id INTEGER REFERENCES medical_records(record_id),
    medication_id INTEGER REFERENCES medications(medication_id),
    dosage VARCHAR(50),
    frequency VARCHAR(50),
    duration VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 