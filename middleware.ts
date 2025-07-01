import type { NextRequest, NextFetchEvent } from "next/server";
import createMiddleware from "next-intl/middleware";
import { clerkMiddleware } from "@clerk/nextjs/server";

const intlMiddleware = createMiddleware( {
  locales: [ "en", "es" ],
  defaultLocale: "es",
} );

export default function middleware(
  request: NextRequest,
  event: NextFetchEvent,
) {
  const clerkResult = clerkMiddleware()( request, event );

  if ( clerkResult instanceof Response ) return clerkResult;

  return intlMiddleware( request );
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};