import { NextResponse } from 'next/server';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';
import { query } from '@/lib/db/queries';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, email } = body;
    if (!user_id || !email) {
      return NextResponse.json({ message: 'user_id and email are required' }, { status: 400 });
    }
    // Generate TOTP secret
    const secret = authenticator.generateSecret();
    // Store secret in DB
    await query('UPDATE users SET mfa_secret = ? WHERE user_id = ?', [secret, user_id]);
    // Generate otpauth URL
    const service = 'SCBMR';
    const otpauth = authenticator.keyuri(email, service, secret);
    // Generate QR code
    const qr = await qrcode.toDataURL(otpauth);
    return NextResponse.json({ secret, otpauth, qr });
  } catch (error) {
    console.error('MFA setup error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 