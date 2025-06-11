import aj from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import { slidingWindow, validateEmail, ArcjetDecision } from "arcjet";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";


const emailValidation = aj.withRule(
    validateEmail({mode: 'LIVE', block: ['DISPOSABLE', 'INVALID', 'NO_MX_RECORDS']})
)

const rateLimit = aj.withRule(
    slidingWindow({
        mode: 'LIVE',
        interval: '2m',
        max: 2,
        characteristics: ['fingerprint']
    })
);

const protectedAuth = async (requestAnimationFrame: NextRequest): Promise<ArcjetDecision> => {
    const session = await auth.api.getSession({
        headers: requestAnimationFrame.headers
    });
    let userId: string;
    if (session && session.user && session.user.id) {
        userId = session.user.id;
    } else {
        userId = ip(req) || '127.0.0.1';
    }

    if(requestAnimationFrame.nextUrl.pathname.startsWith('/api/auth/sign-in')){
        const body = await req.clone().json();

        if(typeof body.email === 'string') {
            return emailValidation.protect(req, { email: body.email});
        }
    }

    return rateLimit.protect(req, { fingerprint: userId });
}


const authHandlers = toNextJsHandler(auth.handler);

export const { GET } = authHandlers;

export const POST = async (req: NextRequest) => {
    const decision = await protectedAuth(req);
    
    if (decision.isDenied()) {
        if(decision.reason.isEmail()) {
            throw new Error('Email validation failed: ');
        }
        if(decision.reason.isRateLimit()) {
            throw new Error('Rate limit exceeded: ');
        }
        if(decision.reason.isShield()) {
            throw new Error ('Shield validation failed: ');
    }

    return authHandlers.POST(req);
}
    // throw new Error('Authentication failed');
}