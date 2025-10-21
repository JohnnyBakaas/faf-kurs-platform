// /middleware.ts
import type { NextRequest } from "next/server";
import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

export function middleware(req: NextRequest) {
  return withAuth(req);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
