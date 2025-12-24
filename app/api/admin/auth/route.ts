/**
 * API Route: /api/admin/auth
 * 
 * Simple password-based authentication for admin panel
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Simple password check - in production, use environment variable
// For now, the password is: "posadzki2024"
const ADMIN_PASSWORD_HASH = crypto
  .createHash('sha256')
  .update(process.env.ADMIN_PASSWORD || 'posadzki2024')
  .digest('hex');

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Hasło jest wymagane' },
        { status: 400 }
      );
    }

    // Hash the provided password
    const providedPasswordHash = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');

    // Check if password matches
    if (providedPasswordHash === ADMIN_PASSWORD_HASH) {
      // Generate a simple token (in production, use JWT)
      const token = crypto.randomBytes(32).toString('hex');
      
      return NextResponse.json({
        success: true,
        token,
        message: 'Zalogowano pomyślnie',
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Nieprawidłowe hasło' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Użyj metody POST aby się zalogować',
    info: 'Endpoint do autoryzacji panelu administracyjnego',
  });
}
