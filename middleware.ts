import { runWithAmplifyServerContext } from "./utils/utils";
import { fetchAuthSession } from "aws-amplify/auth/server";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest){
    const response = NextResponse.next()

    // Set security headers - note that we're using a single line for the CSP
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com 'unsafe-inline'; style-src 'self' https://cdnjs.cloudflare.com 'unsafe-inline'; img-src 'self' data: https://via.placeholder.com https://books-data-for-cloudshelf.s3.amazonaws.com https://books-data-for-cloudshelf.s3.us-east-1.amazonaws.com; font-src 'self'; connect-src 'self' https://3mbrdg00ck.execute-api.us-east-1.amazonaws.com; frame-src 'none'; object-src 'none'; base-uri 'self'"
    )
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()')

    const authenticated = await runWithAmplifyServerContext({
        nextServerContext:  {request, response},
        operation: async (context) => {
            try{
                const session = await fetchAuthSession(context, {})
                return session.tokens !== undefined
            }catch(err){
                console.log(err)
                return false 
            }
        }
    })
    
    if(authenticated){
        return response
    }
    return NextResponse.redirect(new URL('/signup', request.url))
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|signup).*)"]
}