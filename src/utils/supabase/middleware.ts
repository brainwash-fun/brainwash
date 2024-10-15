import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  try {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res });

    // This will refresh the session if needed
    await supabase.auth.getSession();

    return res;
  } catch (e) {
    console.error("Session update error:", e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}

export default async function middleware(request: NextRequest) {
  try {
    const res = await updateSession(request);
    const supabase = createMiddlewareClient({ req: request, res });

    // protected routes
    if (request.nextUrl.pathname.startsWith("/protected")) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
    }

    if (request.nextUrl.pathname === "/") {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        return NextResponse.redirect(new URL("/protected", request.url));
      }
    }

    return res;
  } catch (e) {
    console.error("Middleware error:", e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}

// Optionally, you can specify which routes this middleware applies to
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
