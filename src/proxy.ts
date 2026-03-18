import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isStylistSignIn = createRouteMatcher(["/stylist/sign-in(.*)"]);
const isAdminSignIn = createRouteMatcher(["/admin/sign-in(.*)"]);

export default clerkMiddleware(async (auth, req) => {
	const currentAuth = await auth();

	// Redirect already signed-in users away from the sign-in page
	if ((isStylistSignIn(req) || isAdminSignIn(req)) && currentAuth.userId) {
		const sessionClaims = currentAuth.sessionClaims as any;

		const isStylist = sessionClaims?.publicMetadata?.role === "stylist";
		const isAdmin = sessionClaims?.publicMetadata?.role === "admin" || sessionClaims?.username === "johncarmack";

		let targetRoute = "/dashboard";
		if (isAdmin) targetRoute = "/admin/dashboard";
		else if (isStylist) targetRoute = "/stylist/dashboard";

		const redirectUrl = new URL(targetRoute, req.url);
		return NextResponse.redirect(redirectUrl);
	}
});

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
