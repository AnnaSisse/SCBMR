import { NextResponse } from 'next/server';
import { createUser } from '@/lib/db/medical_queries';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password, role, phone, department } = body;

        if (!name || !email || !password || !role) {
            return NextResponse.json({ message: 'Name, email, password, and role are required' }, { status: 400 });
        }

        const nameParts = name.split(' ');
        const first_name = nameParts[0];
        const last_name = nameParts.slice(1).join(' ');

        // In a real application, you should hash the password before saving
        const newUser = await createUser({ first_name, last_name, email, password, role, phone, department });

        return NextResponse.json({ user: newUser }, { status: 201 });

    } catch (error: any) {
        console.error('Registration error:', error);

        if (error.message === 'DUPLICATE_EMAIL') {
            return NextResponse.json({ message: 'An account with this email already exists.' }, { status: 409 });
        }

        return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
    }
} 