import { dummyStylists } from "@/lib/data";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/stylist/dashboard(.*)"]);
const isStylistSignIn = createRouteMatcher(["/stylist/sign-in(.*)"]);

export default clerkMiddleware(async (auth, req) => {
	const currentAuth = await auth();

	// Redirect already signed-in users away from the sign-in page
	if (isStylistSignIn(req) && currentAuth.userId) {
		const sessionClaims = currentAuth.sessionClaims as any;
		const isStylist = sessionClaims?.publicMetadata?.role === "stylist" || (sessionClaims?.username ? dummyStylists.some((s) => s.username === sessionClaims?.username) : false);
		const redirectUrl = new URL(isStylist ? "/stylist/dashboard" : "/dashboard", req.url);
		return NextResponse.redirect(redirectUrl);
	}

	if (isProtectedRoute(req)) {
		await auth.protect();
	}
});

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
