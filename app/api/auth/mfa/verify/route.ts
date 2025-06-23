import { NextResponse } from 'next/server';
import { authenticator } from 'otplib';
import { query } from '@/lib/db/queries';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, code } = body;
    if (!user_id || !code) {
      return NextResponse.json({ message: 'user_id and code are required' }, { status: 400 });
    }
    // Fetch user's MFA secret
    const [user] = await query('SELECT mfa_secret FROM users WHERE user_id = ?', [user_id]);
    if (!user || !user.mfa_secret) {
      return NextResponse.json({ message: 'MFA not set up for this user' }, { status: 400 });
    }
    // Verify code
    const isValid = authenticator.check(code, user.mfa_secret);
    if (isValid) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid code' }, { status: 401 });
    }
  } catch (error) {
    console.error('MFA verify error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 