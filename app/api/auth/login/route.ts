import { NextResponse } from 'next/server';
import { findUserByCredentials } from '@/lib/db/medical_queries';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, role } = body;

        if (!email || !password || !role) {
            return NextResponse.json({ message: 'Email, password, and role are required' }, { status: 400 });
        }

        const user = await findUserByCredentials({ email, password, role: role.toLowerCase() });

        if (user) {
            // Do not send password back to client
            const { password, ...userWithoutPassword } = user;
            return NextResponse.json({ user: userWithoutPassword });
        } else {
            return NextResponse.json({ message: 'Invalid credentials or role' }, { status: 401 });
        }
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'An internal server error occurred', error: String(error) }, { status: 500 });
    }
} 