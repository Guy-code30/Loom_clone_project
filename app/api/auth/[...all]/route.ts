import aj from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import { slidingWindow, validateEmail, ArcjetDecision } from "arcjet";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

const emailValidation = aj.withRule(
  validateEmail({ mode: 'LIVE', block: ['DISPOSABLE', 'INVALID', 'NO_MX_RECORDS'] })
);

const rateLimit = aj.withRule(
  slidingWindow({
    mode: 'LIVE',
    interval: '2m',
    max: 2,
    characteristics: ['fingerprint']
  })
);

const protectedAuth = async (req: NextRequest): Promise<ArcjetDecision> => {
  const session = await auth.api.getSession({
    headers: req.headers
  });
  
  let userId: string;
  if (session?.user?.id) {
    userId = session.user.id;
  } else {
    userId = ip(req) || '127.0.0.1';
  }

  if (req.nextUrl.pathname.startsWith('/api/auth/sign-in')) {
    const body = await req.clone().json();
    if (typeof body.email === 'string') {
      return emailValidation.protect(req, { email: body.email });
    }
  }

  return rateLimit.protect(req, { fingerprint: userId });
}

const authHandlers = toNextJsHandler(auth.handler);

export const { GET } = authHandlers;

export const POST = async (req: NextRequest) => {
  // Clone right at the start if auth handler needs the body
  const reqForAuth = req.clone();
  
  try {
    const decision = await protectedAuth(req); // Uses original req
    
    if (decision.isDenied()) {
        return NextResponse.json(
            { error: 'Rate limit exceeded. Please try again later.' },
            { status: 429 }
        );
    }

    // Pass the cloned request to auth handler
    return authHandlers.POST(reqForAuth);
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

// Minimal IP implementation (replace with real logic)
function ip(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '';
}