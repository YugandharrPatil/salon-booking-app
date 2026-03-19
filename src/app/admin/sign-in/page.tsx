"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClerk, useUser } from "@clerk/nextjs";
import { AlertCircle, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Single admin credential for autofill
const ADMIN_CREDENTIALS = {
	id: "johncarmack",
	username: "johncarmack",
	name: "John Carmack",
	password: "thisisjohncarmack",
	image_url: "https://i.pravatar.cc/150?u=a042581f4e29026705d",
};

export default function AdminSignInPage() {
	const router = useRouter();
	const clerk = useClerk();
	const { isLoaded, isSignedIn, user } = useUser();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	// Redirect if already signed in and an admin
	// useEffect(() => {
	// 	if (isLoaded && isSignedIn && user) {
	// 		const isAdmin = user.publicMetadata?.role === "admin";
	// 		if (isAdmin) {
	// 			router.push("/admin/dashboard");
	// 		} else {
	// 			router.push("/dashboard");
	// 		}
	// 	}
	// }, [isLoaded, isSignedIn, user, router]);

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			const result = await clerk.client.signIn.create({
				identifier: username,
				password: password,
			});

			if (result.status === "complete") {
				await clerk.setActive({ session: result.createdSessionId });
				router.push("/admin/dashboard");
			} else {
				console.error("SignIn Status:", result.status);
				setError(`Sign in incomplete. Status is: ${result.status}. Check Clerk dashboard settings.`);
			}
		} catch (err: any) {
			console.error(err);
			setError(err.errors?.[0]?.longMessage || err.message || "Invalid admin credentials");
		} finally {
			setIsLoading(false);
		}
	};

	// Function to quickly fill in the test credentials
	const fillCredentials = () => {
		setUsername(ADMIN_CREDENTIALS.username);
		setPassword(ADMIN_CREDENTIALS.password);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-start">
				<div className="space-y-6">
					<div>
						<h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
							<ShieldCheck className="w-8 h-8 text-blue-600" />
							Admin Portal
						</h1>
						<p className="mt-2 text-slate-600">This portal is restricted to authorized administrative personnel only.</p>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Sign in to your account</CardTitle>
							<CardDescription>Enter your designated admin credentials</CardDescription>
						</CardHeader>
						<form onSubmit={handleSignIn}>
							<CardContent className="space-y-4">
								{error && (
									<Alert variant="destructive" className="bg-red-50 text-red-900 border-red-200">
										<AlertCircle className="h-4 w-4" />
										<AlertTitle>Error</AlertTitle>
										<AlertDescription>{error}</AlertDescription>
									</Alert>
								)}
								<div className="space-y-2">
									<Label htmlFor="username">Username</Label>
									<Input id="username" type="text" placeholder="e.g. johncarmack" required value={username} onChange={(e) => setUsername(e.target.value)} disabled={isLoading} />
								</div>
								<div className="space-y-2">
									<Label htmlFor="password">Password</Label>
									<Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
								</div>
							</CardContent>
							<CardFooter className="flex flex-col space-y-4">
								<Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
									{isLoading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Authenticating...
										</>
									) : (
										"Sign In"
									)}
								</Button>
								<div className="w-full pt-4 border-t border-slate-100 flex justify-center">
									<Link href="/sign-in" className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1">
										Access regular client portal <ArrowRight className="w-3 h-3" />
									</Link>
								</div>
							</CardFooter>
						</form>
					</Card>
				</div>

				{/* Admin Credentials Section */}
				<div className="bg-white p-6 sm:p-8 rounded-2xl border border-blue-100 shadow-md h-full">
					<h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2 mb-2">System Administrator Credentials</h2>
					<p className="text-sm text-slate-500 mb-6">Select the admin persona below to autofill the login form. This is for review purposes only.</p>

					<div className="space-y-4">
						<div onClick={fillCredentials} className="group flex items-center p-4 border border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer transition-all">
							<img src={ADMIN_CREDENTIALS.image_url} alt={ADMIN_CREDENTIALS.name} className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 group-hover:border-blue-200" />
							<div className="ml-4 flex-1">
								<p className="text-sm font-semibold text-slate-900 group-hover:text-blue-900">{ADMIN_CREDENTIALS.name}</p>
								<p className="text-xs text-slate-500 font-mono mt-0.5">user: {ADMIN_CREDENTIALS.username}</p>
								<p className="text-xs text-slate-500 font-mono">pass: {ADMIN_CREDENTIALS.password}</p>
							</div>
							<Button variant="ghost" size="sm" className="hidden sm:flex text-blue-600 group-hover:bg-blue-100">
								Autofill
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
