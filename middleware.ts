import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequestWithAuth } from "next-auth/middleware";

// Define role-based access control
const roleBasedAccess = {
  ADMIN: ["/dashboard/admin"],
  DOCTOR: ["/dashboard/doctor"],
  NURSE: ["/dashboard/nurse"],
  PATIENT: ["/dashboard/patient"],
  RECEPTION: ["/dashboard/reception"],
  LAB: ["/dashboard/lab"],
  CIVIL_AUTHORITY: ["/dashboard/civil-authority"],
};

export default async function middleware(request: NextRequestWithAuth) {
  const token = await getToken({ req: request });
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");

  if (isAuthPage) {
    if (token) {
      // Redirect to role-specific dashboard if already authenticated
      const role = token.role as string;
      const roleToPath: { [key: string]: string } = {
        ADMIN: "/dashboard/admin",
        DOCTOR: "/dashboard/doctor",
        NURSE: "/dashboard/nurse",
        PATIENT: "/dashboard/patient",
        RECEPTION: "/dashboard/reception",
        LAB: "/dashboard/lab",
        CIVIL_AUTHORITY: "/dashboard/civil-authority",
      };
      return NextResponse.redirect(new URL(roleToPath[role] || "/dashboard", request.url));
    }
    return null;
  }

  if (!token) {
    let from = request.nextUrl.pathname;
    if (request.nextUrl.search) {
      from += request.nextUrl.search;
    }

    return NextResponse.redirect(
      new URL(`/auth/login?from=${encodeURIComponent(from)}`, request.url)
    );
  }

  // Role-based access control
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const role = token.role as string;
    const path = request.nextUrl.pathname;

    // Allow access to common dashboard routes
    if (path === "/dashboard") {
      const roleToPath: { [key: string]: string } = {
        ADMIN: "/dashboard/admin",
        DOCTOR: "/dashboard/doctor",
        NURSE: "/dashboard/nurse",
        PATIENT: "/dashboard/patient",
        RECEPTION: "/dashboard/reception",
        LAB: "/dashboard/lab",
        CIVIL_AUTHORITY: "/dashboard/civil-authority",
      };
      return NextResponse.redirect(new URL(roleToPath[role] || "/dashboard", request.url));
    }

    // Check if user has access to the specific role-based route
    const pathRole = path.split("/")[2]?.toUpperCase();
    if (pathRole && pathRole !== role) {
      // Redirect to role-specific dashboard if trying to access unauthorized route
      const roleToPath: { [key: string]: string } = {
        ADMIN: "/dashboard/admin",
        DOCTOR: "/dashboard/doctor",
        NURSE: "/dashboard/nurse",
        PATIENT: "/dashboard/patient",
        RECEPTION: "/dashboard/reception",
        LAB: "/dashboard/lab",
        CIVIL_AUTHORITY: "/dashboard/civil-authority",
      };
      return NextResponse.redirect(new URL(roleToPath[role] || "/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/:path*",
  ],
}; 