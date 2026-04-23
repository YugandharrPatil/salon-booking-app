"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { TABLES } from "@/lib/tables";
import { useClerk, useSignIn, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, Lock, Scissors, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
	username: z.string().min(1, { message: "Username is required" }),
	password: z.string().min(1, { message: "Password is required" }),
});

export default function StylistSignIn() {
	const { signIn } = useSignIn() as any;
	const { setActive } = useClerk() as any;
	const { user, isLoaded: userLoaded } = useUser();
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	// Fetch stylists from DB for the autofill cards
	const { data: stylists = [], isLoading: isLoadingStylists } = useQuery({
		queryKey: ["stylists"],
		queryFn: async () => {
			const { data, error } = await supabase.from(TABLES.STYLISTS).select("id, name, image_url, password, description").order("name", { ascending: true });
			if (error) throw error;
			return data;
		},
	});

	useEffect(() => {
		if (userLoaded && user) {
			const isStylist = user.publicMetadata?.role === "stylist";
			if (isStylist) {
				router.push("/stylist/dashboard");
			} else {
				router.push("/dashboard");
			}
		}
	}, [user, userLoaded, router]);

	const signInMutation = useMutation({
		mutationFn: async (values: z.infer<typeof formSchema>) => {
			if (!signIn) throw new Error("Sign in not available");
			const result = await signIn.create({
				identifier: values.username,
				password: values.password,
				strategy: "password",
			});
			return result;
		},
		onSuccess: async (result) => {
			const currentStatus = result?.status || signIn.status;
			if (currentStatus === "complete") {
				await setActive({ session: result?.createdSessionId || signIn.createdSessionId });
				router.push("/stylist/dashboard");
			} else {
				console.error("SignIn Status fell through:", currentStatus);
				throw new Error(`Sign in incomplete. Status is: ${currentStatus}. Check Clerk dashboard settings (e.g., forced password change).`);
			}
		},
	});

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		signInMutation.mutate(values);
	};

	const autofill = (u: string, p: string) => {
		form.setValue("username", u);
		form.setValue("password", p);
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
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<CardContent className="space-y-4">
							{signInMutation.error && (
								<div className="bg-red-50 text-red-600 p-3 rounded-md text-sm font-medium border border-red-200">{(signInMutation.error as any).errors?.[0]?.message || signInMutation.error.message || "Invalid styling credentials"}</div>
							)}
							<FieldGroup>
								<Controller
									name="username"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor="username">Username</FieldLabel>
											<div className="relative">
												<User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
												<Input id="username" placeholder="e.g. neha_sharma" className="pl-9" aria-invalid={fieldState.invalid} {...field} />
											</div>
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
											<div className="relative">
												<Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
												<Input id="password" type="password" className="pl-9" aria-invalid={fieldState.invalid} {...field} />
											</div>
											{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
										</Field>
									)}
								/>
							</FieldGroup>
						</CardContent>
						<CardFooter>
							<Button className="w-full" type="submit" disabled={signInMutation.isPending || !signIn}>
								{signInMutation.isPending ? "Signing in..." : "Sign In to Portal"}
							</Button>
						</CardFooter>
					</form>
				</Card>

				{/* Stylist Accounts from DB */}
				<div className="space-y-6">
					<div>
						<h3 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600 mb-2">Stylist Accounts</h3>
						<p className="text-sm text-slate-600">Select a stylist account below to autofill credentials and test the portal flow.</p>
					</div>

					{isLoadingStylists ? (
						<div className="flex items-center justify-center py-8">
							<Loader2 className="w-6 h-6 animate-spin text-blue-500" />
						</div>
					) : stylists.length === 0 ? (
						<div className="text-center py-8 text-slate-400">
							<Scissors className="w-10 h-10 mx-auto mb-2 text-slate-300" />
							<p className="text-sm">No stylists registered yet.</p>
						</div>
					) : (
						<div className="grid gap-4">
							{stylists.map((stylist) => (
								<Card key={stylist.id} className="cursor-pointer hover:border-blue-300 transition-colors hover:bg-blue-50/50 group" onClick={() => autofill(stylist.id, stylist.password || "")}>
									<div className="p-4 flex items-center justify-between">
										<div className="flex items-center gap-3">
											{stylist.image_url ? (
												<img src={stylist.image_url} className="w-10 h-10 rounded-full object-cover border" alt={stylist.name} />
											) : (
												<div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center border">
													<Scissors className="w-4 h-4 text-slate-400" />
												</div>
											)}
											<div>
												<p className="font-semibold">{stylist.name}</p>
												<p className="text-xs text-slate-500 font-mono">{stylist.description}</p>
											</div>
										</div>
										<Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
											Autofill
										</Button>
									</div>
								</Card>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
