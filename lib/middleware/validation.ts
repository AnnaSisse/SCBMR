import { NextResponse } from 'next/server';

// Validation schemas
const schemas = {
    patient: {
        required: ['first_name', 'last_name', 'date_of_birth'],
        types: {
            first_name: 'string',
            last_name: 'string',
            date_of_birth: 'date',
            gender: 'string',
            phone_number: 'string',
            email: 'string',
            address: 'string'
        }
    },
    doctor: {
        required: ['first_name', 'last_name'],
        types: {
            first_name: 'string',
            last_name: 'string',
            specialization: 'string',
            phone_number: 'string',
            email: 'string'
        }
    },
    appointment: {
        required: ['patient_id', 'doctor_id', 'appointment_date'],
        types: {
            patient_id: 'number',
            doctor_id: 'number',
            appointment_date: 'date',
            status: 'string',
            notes: 'string'
        }
    },
    medicalRecord: {
        required: ['patient_id', 'doctor_id', 'diagnosis'],
        types: {
            patient_id: 'number',
            doctor_id: 'number',
            diagnosis: 'string',
            prescription: 'string'
        }
    },
    medication: {
        required: ['name'],
        types: {
            name: 'string',
            description: 'string',
            dosage: 'string'
        }
    }
};

// Validation functions
function isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
}

function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
}

// Main validation function
export function validateRequest(schemaName: keyof typeof schemas, data: any) {
    const schema = schemas[schemaName];
    const errors: string[] = [];

    // Check required fields
    for (const field of schema.required) {
        if (!data[field]) {
            errors.push(`${field} is required`);
        }
    }

    // Check field types and formats
    for (const [field, type] of Object.entries(schema.types)) {
        if (data[field]) {
            switch (type) {
                case 'string':
                    if (typeof data[field] !== 'string') {
                        errors.push(`${field} must be a string`);
                    }
                    break;
                case 'number':
                    if (isNaN(Number(data[field]))) {
                        errors.push(`${field} must be a number`);
                    }
                    break;
                case 'date':
                    if (!isValidDate(data[field])) {
                        errors.push(`${field} must be a valid date`);
                    }
                    break;
            }

            // Additional format validations
            if (field === 'email' && data[field] && !isValidEmail(data[field])) {
                errors.push('Invalid email format');
            }
            if (field === 'phone_number' && data[field] && !isValidPhoneNumber(data[field])) {
                errors.push('Invalid phone number format');
            }
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

// Middleware function
export function withValidation(schemaName: keyof typeof schemas) {
    return async function(request: Request) {
        try {
            const body = await request.json();
            const validation = validateRequest(schemaName, body);

            if (!validation.isValid) {
                return NextResponse.json({
                    success: false,
                    message: 'Validation failed',
                    errors: validation.errors
                }, { status: 400 });
            }

            return body;
        } catch (error) {
            return NextResponse.json({
                success: false,
                message: 'Invalid request body',
                error: error instanceof Error ? error.message : 'Unknown error'
            }, { status: 400 });
        }
    };
} 