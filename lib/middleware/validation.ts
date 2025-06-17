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
        },
        validations: {
            first_name: (value: string) => value.length >= 2 && value.length <= 50,
            last_name: (value: string) => value.length >= 2 && value.length <= 50,
            gender: (value: string) => ['Male', 'Female', 'Other'].includes(value),
            date_of_birth: (value: string) => {
                const date = new Date(value);
                const today = new Date();
                return date < today && date > new Date('1900-01-01');
            }
        }
    },
    doctor: {
        required: ['first_name', 'last_name', 'specialization'],
        types: {
            first_name: 'string',
            last_name: 'string',
            specialization: 'string',
            phone_number: 'string',
            email: 'string'
        },
        validations: {
            first_name: (value: string) => value.length >= 2 && value.length <= 50,
            last_name: (value: string) => value.length >= 2 && value.length <= 50,
            specialization: (value: string) => value.length >= 3 && value.length <= 100
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
        },
        validations: {
            appointment_date: (value: string) => {
                const date = new Date(value);
                const now = new Date();
                return date > now;
            },
            status: (value: string) => ['scheduled', 'completed', 'cancelled', 'no-show'].includes(value)
        }
    },
    medicalRecord: {
        required: ['patient_id', 'doctor_id', 'diagnosis'],
        types: {
            patient_id: 'number',
            doctor_id: 'number',
            diagnosis: 'string',
            prescription: 'string'
        },
        validations: {
            diagnosis: (value: string) => value.length >= 3 && value.length <= 1000
        }
    },
    medication: {
        required: ['name', 'dosage'],
        types: {
            name: 'string',
            description: 'string',
            dosage: 'string'
        },
        validations: {
            name: (value: string) => value.length >= 2 && value.length <= 100,
            dosage: (value: string) => /^\d+\s*(mg|g|ml|L|IU|mcg)(\/\d+\s*(mg|g|ml|L|IU|mcg))?$/.test(value)
        }
    },
    prescription: {
        required: ['record_id', 'medication_id', 'dosage', 'frequency', 'duration'],
        types: {
            record_id: 'number',
            medication_id: 'number',
            dosage: 'string',
            frequency: 'string',
            duration: 'string'
        },
        validations: {
            frequency: (value: string) => /^(once|twice|thrice|four times) (daily|weekly|monthly)$/.test(value),
            duration: (value: string) => /^\d+\s*(day|week|month)s?$/.test(value)
        }
    },
    patientHistory: {
        required: ['patient_id'],
        types: {
            patient_id: 'number',
            start_date: 'date',
            end_date: 'date',
            record_type: 'string'
        },
        validations: {
            start_date: (value: string) => {
                const date = new Date(value);
                return date instanceof Date && !isNaN(date.getTime());
            },
            end_date: (value: string, data: any) => {
                const date = new Date(value);
                const startDate = new Date(data.start_date);
                return date instanceof Date && !isNaN(date.getTime()) && date >= startDate;
            },
            record_type: (value: string) => ['all', 'appointments', 'prescriptions', 'medical_records'].includes(value)
        }
    },
    doctorSchedule: {
        required: ['doctor_id', 'date'],
        types: {
            doctor_id: 'number',
            date: 'date',
            start_time: 'string',
            end_time: 'string'
        },
        validations: {
            date: (value: string) => {
                const date = new Date(value);
                return date instanceof Date && !isNaN(date.getTime()) && date >= new Date();
            },
            start_time: (value: string) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value),
            end_time: (value: string, data: any) => {
                if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) return false;
                return new Date(`2000-01-01T${value}`) > new Date(`2000-01-01T${data.start_time}`);
            }
        }
    },
    patientSearch: {
        required: [],
        types: {
            query: 'string',
            gender: 'string',
            age_min: 'number',
            age_max: 'number',
            last_visit_before: 'date',
            last_visit_after: 'date',
            has_active_prescription: 'boolean',
            specialization: 'string'
        },
        validations: {
            query: (value: string) => value.length >= 2,
            gender: (value: string) => ['Male', 'Female', 'Other'].includes(value),
            age_min: (value: number) => value >= 0 && value <= 120,
            age_max: (value: number, data: any) => {
                return value >= 0 && value <= 120 && value >= (data.age_min || 0);
            },
            last_visit_before: (value: string) => {
                const date = new Date(value);
                return date instanceof Date && !isNaN(date.getTime());
            },
            last_visit_after: (value: string, data: any) => {
                const date = new Date(value);
                const beforeDate = new Date(data.last_visit_before);
                return date instanceof Date && !isNaN(date.getTime()) && date <= beforeDate;
            },
            specialization: (value: string) => {
                const validSpecializations = [
                    'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
                    'Neurology', 'Obstetrics', 'Ophthalmology', 'Orthopedics',
                    'Pediatrics', 'Psychiatry', 'Urology'
                ];
                return validSpecializations.includes(value);
            }
        }
    },
    doctorAvailability: {
        required: ['doctor_id', 'start_date', 'end_date'],
        types: {
            doctor_id: 'number',
            start_date: 'date',
            end_date: 'date',
            days_of_week: 'array',
            start_time: 'string',
            end_time: 'string',
            break_start: 'string',
            break_end: 'string'
        },
        validations: {
            start_date: (value: string) => {
                const date = new Date(value);
                return date instanceof Date && !isNaN(date.getTime()) && date >= new Date();
            },
            end_date: (value: string, data: any) => {
                const date = new Date(value);
                const startDate = new Date(data.start_date);
                return date instanceof Date && !isNaN(date.getTime()) && date >= startDate;
            },
            days_of_week: (value: number[]) => {
                return value.every(day => day >= 0 && day <= 6);
            },
            start_time: (value: string) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value),
            end_time: (value: string, data: any) => {
                if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) return false;
                return new Date(`2000-01-01T${value}`) > new Date(`2000-01-01T${data.start_time}`);
            },
            break_start: (value: string, data: any) => {
                if (!value) return true;
                if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) return false;
                return new Date(`2000-01-01T${value}`) > new Date(`2000-01-01T${data.start_time}`);
            },
            break_end: (value: string, data: any) => {
                if (!value) return true;
                if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) return false;
                return new Date(`2000-01-01T${value}`) < new Date(`2000-01-01T${data.end_time}`);
            }
        }
    },
    appointmentBooking: {
        required: ['patient_id', 'doctor_id', 'appointment_date'],
        types: {
            patient_id: 'number',
            doctor_id: 'number',
            appointment_date: 'date',
            reason: 'string',
            is_urgent: 'boolean',
            preferred_time: 'string'
        },
        validations: {
            appointment_date: (value: string) => {
                const date = new Date(value);
                return date instanceof Date && !isNaN(date.getTime()) && date > new Date();
            },
            reason: (value: string) => value.length >= 10 && value.length <= 500,
            preferred_time: (value: string) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)
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

            // Custom validations
            if (schema.validations && schema.validations[field]) {
                const validationFn = schema.validations[field];
                if (!validationFn(data[field])) {
                    errors.push(`Invalid ${field} format or value`);
                }
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