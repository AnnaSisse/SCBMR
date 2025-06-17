-- Create a test table
CREATE TABLE IF NOT EXISTS test_table (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert a test record
INSERT INTO test_table (name) VALUES ('Test Record');

CREATE TABLE IF NOT EXISTS doctor_availability (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER NOT NULL REFERENCES doctors(doctor_id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days_of_week INTEGER[] NOT NULL, -- Array of days (0-6, where 0 is Sunday)
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    break_start TIME,
    break_end TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_dates CHECK (end_date >= start_date),
    CONSTRAINT valid_times CHECK (end_time > start_time),
    CONSTRAINT valid_break_times CHECK (
        (break_start IS NULL AND break_end IS NULL) OR
        (break_start IS NOT NULL AND break_end IS NOT NULL AND break_end > break_start)
    ),
    CONSTRAINT valid_days_of_week CHECK (
        array_length(days_of_week, 1) > 0 AND
        array_length(days_of_week, 1) <= 7 AND
        days_of_week <@ ARRAY[0,1,2,3,4,5,6]::INTEGER[]
    )
);

CREATE INDEX idx_doctor_availability_dates ON doctor_availability(doctor_id, start_date, end_date); 