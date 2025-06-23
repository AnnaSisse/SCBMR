import { NextRequest, NextResponse } from 'next/server';

// Usage: requireRole(['Doctor', 'Admin'])(handler)
export function requireRole(allowedRoles: string[]) {
  return function (handler: (req: NextRequest) => Promise<Response> | Response) {
    return async function (req: NextRequest) {
      // Assume user info is attached to the request (e.g., via session or JWT)
      // For demo, get from headers (in production, use proper auth/session)
      const userRole = req.headers.get('x-user-role');
      if (!userRole || !allowedRoles.includes(userRole)) {
        return NextResponse.json({ message: 'Forbidden: insufficient role' }, { status: 403 });
      }
      return handler(req);
    };
  };
} 