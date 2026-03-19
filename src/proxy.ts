import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isHome = createRouteMatcher(["/"]);
const isStylistSignIn = createRouteMatcher(["/stylist/sign-in(.*)"]);
const isAdminSignIn = createRouteMatcher(["/admin/sign-in(.*)"]);
const isUserSignIn = createRouteMatcher(["/sign-in(.*)"]);

const adminProtectedRoutes = createRouteMatcher(["/admin(.*)"]);
const stylistProtectedRoutes = createRouteMatcher(["/stylist/(.*)"]);
const userProtectedRoutes = createRouteMatcher(["/dashboard(.*)", "/services(.*)", "/stylists(.*)"]);

const publicRoutes = createRouteMatcher(["/admin/sign-in(.*)", "/stylist/sign-in(.*)", "/sign-in(.*)"]);

export default clerkMiddleware(async (auth, req) => {
	const currentAuth = await auth();

	const sessionClaims = currentAuth.sessionClaims as { publicMetadata?: { role?: string } } | undefined;

	const role = sessionClaims?.publicMetadata?.role;
	// console.log(role);

	const isStylist = role === "stylist";
	const isAdmin = role === "admin";
	const isUser = role === "user" || (!role && currentAuth.userId);
	const isLoggedIn = !!currentAuth.userId;

	// redirect already signed-in users away from the sign-in page and homepage to their dashboard
	if ((isStylistSignIn(req) || isAdminSignIn(req) || isUserSignIn(req) || isHome(req)) && isLoggedIn) {
		let targetRoute = "/dashboard";
		if (isAdmin) targetRoute = "/admin/dashboard";
		else if (isStylist) targetRoute = "/stylist/dashboard";
		const redirectUrl = new URL(targetRoute, req.url);
		return NextResponse.redirect(redirectUrl);
	}

	// protect role specific pages
	if (adminProtectedRoutes(req) && !publicRoutes(req)) {
		if (!isLoggedIn) await auth.protect();
		else if (!isAdmin) return NextResponse.redirect(new URL("/unauthorized", req.url));
	}

	if (stylistProtectedRoutes(req) && !publicRoutes(req)) {
		if (!isLoggedIn) await auth.protect();
		else if (!isStylist) return NextResponse.redirect(new URL("/unauthorized", req.url));
	}

	if (userProtectedRoutes(req) && !publicRoutes(req)) {
		if (!isLoggedIn) await auth.protect();
		else if (!isUser) return NextResponse.redirect(new URL("/unauthorized", req.url));
	}
});

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};

// export const config = {
// 	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };
