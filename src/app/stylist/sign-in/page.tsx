"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { dummyStylists } from "@/lib/data";
import { useClerk, useSignIn, useUser } from "@clerk/nextjs";
import { Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StylistSignIn() {
	const { signIn } = useSignIn() as any;
	const { setActive } = useClerk() as any;
	const { user, isLoaded: userLoaded } = useUser();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if (userLoaded && user) {
			const isStylist = user.publicMetadata?.role === "stylist" || (user.username ? dummyStylists.some((s) => s.username === user.username) : false);
			if (isStylist) {
				router.push("/stylist/dashboard");
			} else {
				router.push("/dashboard");
			}
		}
	}, [user, userLoaded, router]);

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!signIn) return;

		try {
			setLoading(true);
			setError("");

			const result = await signIn.create({
				identifier: username,
				password,
				strategy: "password",
			});

			const currentStatus = result?.status || signIn.status;

			if (currentStatus === "complete") {
				await setActive({ session: result?.createdSessionId || signIn.createdSessionId });
				router.push("/stylist/dashboard");
			} else {
				console.error("SignIn Status fell through:", currentStatus);
				setError(`Sign in incomplete. Status is: ${currentStatus}. Check Clerk dashboard settings (e.g., forced password change).`);
			}
		} catch (err: any) {
			console.error(err);
			setError(err.errors?.[0]?.message || "Invalid styling credentials");
		} finally {
			setLoading(false);
		}
	};

	const autofill = (u: string, p: string) => {
		setUsername(u);
		setPassword(p);
	};

	return (
		<div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
			<div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-start">
				{/* Sign In Form */}
				<Card className="w-full">
					<CardHeader className="space-y-1">
						<CardTitle className="text-2xl font-bold tracking-tight">Stylist Portal</CardTitle>
						<CardDescription>Sign in to manage your appointments and schedule.</CardDescription>
					</CardHeader>
					<form onSubmit={handleSignIn}>
						<CardContent className="space-y-4">
							{error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm font-medium border border-red-200">{error}</div>}
							<div className="space-y-2">
								<Label htmlFor="username">Username</Label>
								<div className="relative">
									<User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
									<Input id="username" placeholder="e.g. neha_sharma" className="pl-9" value={username} onChange={(e) => setUsername(e.target.value)} required />
								</div>
							</div>
							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
									<Input id="password" type="password" className="pl-9" value={password} onChange={(e) => setPassword(e.target.value)} required />
								</div>
							</div>
						</CardContent>
						<CardFooter>
							<Button className="w-full" type="submit" disabled={loading || !signIn}>
								{loading ? "Signing in..." : "Sign In to Portal"}
							</Button>
						</CardFooter>
					</form>
				</Card>

				{/* Public Test Credentials */}
				<div className="space-y-6">
					<div>
						<h3 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600 mb-2">Public Test Accounts</h3>
						<p className="text-sm text-slate-600">Select one of the dummy stylist accounts below to test the portal flow.</p>
					</div>

					<div className="grid gap-4">
						{dummyStylists.map((stylist) => (
							<Card key={stylist.id} className="cursor-pointer hover:border-blue-300 transition-colors hover:bg-blue-50/50 group" onClick={() => autofill(stylist.username, stylist.password)}>
								<div className="p-4 flex items-center justify-between">
									<div className="flex items-center gap-3">
										<img src={stylist.image_url} className="w-10 h-10 rounded-full object-cover border" alt={stylist.name} />
										<div>
											<p className="font-semibold">{stylist.name}</p>
											<p className="text-xs text-slate-500 font-mono">user: {stylist.username}</p>
										</div>
									</div>
									<Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
										Autofill
									</Button>
								</div>
							</Card>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
