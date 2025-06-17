-- Create medications table
CREATE TABLE IF NOT EXISTS medications (
    medication_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    dosage_form VARCHAR(100),
    strength VARCHAR(100),
    manufacturer VARCHAR(255),
    storage_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name)
);

-- Create prescription_medications table for linking medications to prescriptions
CREATE TABLE IF NOT EXISTS prescription_medications (
    prescription_id SERIAL PRIMARY KEY,
    record_id INTEGER NOT NULL REFERENCES medical_records(record_id) ON DELETE CASCADE,
    medication_id INTEGER NOT NULL REFERENCES medications(medication_id) ON DELETE RESTRICT,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    instructions TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create medication_categories table for standardized categories
CREATE TABLE IF NOT EXISTS medication_categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create medication_interactions table for tracking drug interactions
CREATE TABLE IF NOT EXISTS medication_interactions (
    interaction_id SERIAL PRIMARY KEY,
    medication_id_1 INTEGER NOT NULL REFERENCES medications(medication_id) ON DELETE CASCADE,
    medication_id_2 INTEGER NOT NULL REFERENCES medications(medication_id) ON DELETE CASCADE,
    severity VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(medication_id_1, medication_id_2)
);

-- Create medication_allergies table
CREATE TABLE IF NOT EXISTS medication_allergies (
    allergy_id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,
    medication_id INTEGER NOT NULL REFERENCES medications(medication_id) ON DELETE CASCADE,
    reaction TEXT NOT NULL,
    severity VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(patient_id, medication_id)
);

-- Create medication_inventory table for tracking stock
CREATE TABLE IF NOT EXISTS medication_inventory (
    inventory_id SERIAL PRIMARY KEY,
    medication_id INTEGER NOT NULL REFERENCES medications(medication_id) ON DELETE CASCADE,
    batch_number VARCHAR(100),
    quantity INTEGER NOT NULL,
    expiry_date DATE NOT NULL,
    supplier VARCHAR(255),
    purchase_date DATE,
    purchase_price DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_medications_name ON medications(name);
CREATE INDEX IF NOT EXISTS idx_medications_category ON medications(category);
CREATE INDEX IF NOT EXISTS idx_prescription_medications_record_id ON prescription_medications(record_id);
CREATE INDEX IF NOT EXISTS idx_prescription_medications_medication_id ON prescription_medications(medication_id);
CREATE INDEX IF NOT EXISTS idx_medication_allergies_patient_id ON medication_allergies(patient_id);
CREATE INDEX IF NOT EXISTS idx_medication_inventory_medication_id ON medication_inventory(medication_id);
CREATE INDEX IF NOT EXISTS idx_medication_inventory_expiry_date ON medication_inventory(expiry_date);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_medications_updated_at
    BEFORE UPDATE ON medications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prescription_medications_updated_at
    BEFORE UPDATE ON prescription_medications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medication_interactions_updated_at
    BEFORE UPDATE ON medication_interactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medication_allergies_updated_at
    BEFORE UPDATE ON medication_allergies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medication_inventory_updated_at
    BEFORE UPDATE ON medication_inventory
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 