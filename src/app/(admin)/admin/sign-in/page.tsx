"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useClerk } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
	username: z.string().min(1, { message: "Username is required" }),
	password: z.string().min(1, { message: "Password is required" }),
});

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

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	const signInMutation = useMutation({
		mutationFn: async (values: z.infer<typeof formSchema>) => {
			const result = await clerk.client.signIn.create({
				identifier: values.username,
				password: values.password,
			});
			return result;
		},
		onSuccess: async (result) => {
			if (result.status === "complete") {
				await clerk.setActive({ session: result.createdSessionId });
				router.push("/admin/dashboard");
			} else {
				console.error("SignIn Status:", result.status);
				throw new Error(`Sign in incomplete. Status is: ${result.status}. Check Clerk dashboard settings.`);
			}
		},
	});

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		signInMutation.mutate(values);
	};

	// Function to quickly fill in the test credentials
	const fillCredentials = () => {
		form.setValue("username", ADMIN_CREDENTIALS.username);
		form.setValue("password", ADMIN_CREDENTIALS.password);
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
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<CardContent className="space-y-4">
								{signInMutation.error && (
									<Alert variant="destructive" className="bg-red-50 text-red-900 border-red-200">
										<AlertCircle className="h-4 w-4" />
										<AlertTitle>Error</AlertTitle>
										<AlertDescription>{(signInMutation.error as any).errors?.[0]?.longMessage || signInMutation.error.message || "Invalid admin credentials"}</AlertDescription>
									</Alert>
								)}
								<FieldGroup>
									<Controller
										name="username"
										control={form.control}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor="username">Username</FieldLabel>
												<Input id="username" type="text" placeholder="e.g. johncarmack" disabled={signInMutation.isPending} aria-invalid={fieldState.invalid} {...field} />
												{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
											</Field>
										)}
									/>
									<Controller
										name="password"
										control={form.control}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor="password">Password</FieldLabel>
												<Input id="password" type="password" disabled={signInMutation.isPending} aria-invalid={fieldState.invalid} {...field} />
												{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
											</Field>
										)}
									/>
								</FieldGroup>
							</CardContent>
							<CardFooter className="flex flex-col space-y-4">
								<Button type="submit" className="w-full" disabled={signInMutation.isPending}>
									{signInMutation.isPending ? (
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
