import { NextResponse, type NextRequest } from "next/server";

export default async function authMiddleware(request: NextRequest) {
    // Check for the session cookie first - this is fast and reliable
    const sessionToken = request.cookies.get("better-auth.session_token") || 
                         request.cookies.get("__Secure-better-auth.session_token") ||
                         request.cookies.get("__secure-better-auth.session_token");

    // If no cookie at all, we're definitely not logged in
    if (!sessionToken) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Since we have a cookie, let's verify it with the API
    try {
        const origin = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BETTER_AUTH_URL || request.nextUrl.origin;
        const sessionResponse = await fetch(
            `${origin}/api/auth/get-session`,
            {
                headers: {
                    cookie: request.headers.get("cookie") || "",
                },
            },
        );

        if (!sessionResponse.ok) {
            console.error("Middleware Auth: Get-session failed with status", sessionResponse.status);
            return NextResponse.redirect(new URL("/login", request.url));
        }

        const sessionData = await sessionResponse.json();

        // Better Auth returns null or { user: null } if no active session
        if (!sessionData || !sessionData.user) {
            console.warn("Middleware Auth: No user in session data");
            return NextResponse.redirect(new URL("/login", request.url));
        }
    } catch (error) {
        console.error("Middleware Auth Error:", error);
        // On error, we fallback to login for security
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/health-vault/:path*", "/doctor-meetup/:path*", "/hydration/:path*"],
};
