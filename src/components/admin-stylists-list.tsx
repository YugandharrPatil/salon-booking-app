"use client";

import { createStylist, deleteStylist, updateStylist } from "@/app/actions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { TABLES } from "@/lib/tables";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit2, Loader2, Scissors, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";

interface Stylist {
	id: string;
	name: string;
	image_url: string | null;
	service_ids: string[];
}

interface Service {
	id: string;
	name: string;
}

export function AdminStylistsList() {
	const queryClient = useQueryClient();
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [editingStylist, setEditingStylist] = useState<Stylist | null>(null);

	// Form State
	const [username, setUsername] = useState("");
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
	const [mutationError, setMutationError] = useState<string | null>(null);

	// Fetch all stylists
	const {
		data: stylists,
		isLoading: isLoadingStylists,
		error: stylistsError,
	} = useQuery({
		queryKey: ["admin-stylists"],
		queryFn: async () => {
			const { data, error } = await supabase.from(TABLES.STYLISTS).select("*").order("name", { ascending: true });
			if (error && error.code !== "PGRST116") throw error;
			return data as Stylist[];
		},
	});

	// Fetch all services (for the checkboxes)
	const { data: services } = useQuery({
		queryKey: ["all-services"],
		queryFn: async () => {
			const { data, error } = await supabase.from(TABLES.SERVICES).select("id, name").order("name", { ascending: true });
			if (error) throw error;
			return data as Service[];
		},
	});

	const createMutation = useMutation({
		mutationFn: async () => {
			setMutationError(null);
			await createStylist({
				username,
				name,
				password,
				email,
				image_url: imageUrl || null,
				service_ids: selectedServiceIds,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-stylists"] });
			setIsCreateOpen(false);
			resetForm();
		},
		onError: (err: Error) => {
			setMutationError(err.message);
		},
	});

	const updateMutation = useMutation({
		mutationFn: async () => {
			if (!editingStylist) return;
			setMutationError(null);
			await updateStylist(editingStylist.id, {
				name,
				image_url: imageUrl || null,
				service_ids: selectedServiceIds,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-stylists"] });
			setEditingStylist(null);
			resetForm();
		},
		onError: (err: Error) => {
			setMutationError(err.message);
		},
	});

	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			await deleteStylist(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-stylists"] });
		},
	});

	const resetForm = () => {
		setUsername("");
		setName("");
		setPassword("");
		setEmail("");
		setImageUrl("");
		setSelectedServiceIds([]);
		setMutationError(null);
	};

	const handleEditClick = (stylist: Stylist) => {
		setEditingStylist(stylist);
		setName(stylist.name);
		setImageUrl(stylist.image_url || "");
		setSelectedServiceIds(stylist.service_ids || []);
		setMutationError(null);
	};

	const toggleService = (serviceId: string) => {
		setSelectedServiceIds((prev) => (prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]));
	};

	const getServiceNames = (serviceIds: string[]): string => {
		if (!services || serviceIds.length === 0) return "No services assigned";
		return serviceIds
			.map((id) => services.find((s) => s.id === id)?.name)
			.filter(Boolean)
			.join(", ");
	};

	if (isLoadingStylists) {
		return (
			<div className="flex flex-col justify-center items-center py-32 text-slate-500 bg-white rounded-xl border border-slate-200">
				<Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
				<span className="text-lg font-medium">Loading stylists...</span>
			</div>
		);
	}

	if (stylistsError) {
		return <div className="text-center py-10 bg-red-50 text-red-600 rounded-xl border border-red-200">Failed to load stylists. Please check your connection.</div>;
	}

	// Render the service checkboxes for create/edit modals
	const renderServiceCheckboxes = () => (
		<div className="grid gap-2">
			<Label>Assigned Services</Label>
			{!services || services.length === 0 ? (
				<p className="text-sm text-slate-400">No services found. Create services first.</p>
			) : (
				<div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto border rounded-lg p-3 bg-slate-50">
					{services.map((service) => (
						<label key={service.id} className="flex items-center gap-3 cursor-pointer hover:bg-white rounded-md px-2 py-1.5 transition-colors">
							<input type="checkbox" checked={selectedServiceIds.includes(service.id)} onChange={() => toggleService(service.id)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4" />
							<span className="text-sm font-medium text-slate-700">{service.name}</span>
						</label>
					))}
				</div>
			)}
		</div>
	);

	// Render form fields for create modal
	const renderCreateFormFields = () => (
		<div className="grid gap-4 py-4">
			{mutationError && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm font-medium border border-red-200">{mutationError}</div>}
			<div className="grid gap-2">
				<Label htmlFor="username">Username (used for sign-in)</Label>
				<Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. priya_patel" required />
			</div>
			<div className="grid gap-2">
				<Label htmlFor="stylistName">Display Name</Label>
				<Input id="stylistName" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Priya Patel" required />
			</div>
			<div className="grid gap-2">
				<Label htmlFor="email">Email Address</Label>
				<Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. priya@salon.com" required />
			</div>
			<div className="grid gap-2">
				<Label htmlFor="password">Initial Password</Label>
				<Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Temporary password (min 8 chars)" required />
			</div>
			<div className="grid gap-2">
				<Label htmlFor="imageUrl">Avatar URL (Optional)</Label>
				<Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://i.pravatar.cc/150?u=unique" />
			</div>
			{renderServiceCheckboxes()}
		</div>
	);

	// Render form fields for edit modal
	const renderEditFormFields = () => (
		<div className="grid gap-4 py-4">
			{mutationError && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm font-medium border border-red-200">{mutationError}</div>}
			<div className="grid gap-2">
				<Label htmlFor="stylistName">Display Name</Label>
				<Input id="stylistName" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Priya Patel" required />
			</div>
			<div className="grid gap-2">
				<Label htmlFor="imageUrl">Avatar URL (Optional)</Label>
				<Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://i.pravatar.cc/150?u=unique" />
			</div>
			{renderServiceCheckboxes()}
		</div>
	);

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
				<div>
					<h2 className="text-2xl font-bold text-slate-800">Stylist Team</h2>
					<p className="text-slate-500 text-sm mt-1">Manage your salon&apos;s stylists and their service assignments.</p>
				</div>

				<Dialog
					open={isCreateOpen}
					onOpenChange={(open) => {
						setIsCreateOpen(open);
						if (!open) resetForm();
					}}
				>
					<DialogTrigger asChild>
						<Button className="bg-blue-600 hover:bg-blue-700">
							<UserPlus className="w-4 h-4 mr-2" />
							Add Stylist
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add New Stylist</DialogTitle>
							<DialogDescription>Create a new stylist account. This will also create their Clerk login credentials.</DialogDescription>
						</DialogHeader>
						{renderCreateFormFields()}
						<DialogFooter>
							<Button variant="outline" onClick={() => setIsCreateOpen(false)}>
								Cancel
							</Button>
							<Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !username || !name || !email || !password || password.length < 8}>
								{createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Create Stylist"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			{!stylists || stylists.length === 0 ? (
				<div className="text-center py-24 bg-white rounded-xl border border-slate-200 shadow-sm">
					<Scissors className="w-16 h-16 text-slate-200 mx-auto mb-4" />
					<h3 className="text-xl font-bold text-slate-700 mb-2">No Stylists Registered</h3>
					<p className="text-slate-500 max-w-sm mx-auto">Add your first stylist to start assigning appointments.</p>
				</div>
			) : (
				<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
					{stylists.map((stylist) => (
						<Card key={stylist.id} className="flex flex-col overflow-hidden hover:shadow-md transition-shadow">
							<CardHeader className="bg-slate-50 border-b border-slate-100">
								<div className="flex items-center gap-4">
									{stylist.image_url ? (
										<img src={stylist.image_url} alt={stylist.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
									) : (
										<div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center border-2 border-white shadow-sm">
											<Scissors className="w-6 h-6 text-slate-400" />
										</div>
									)}
									<div>
										<CardTitle className="text-lg">{stylist.name}</CardTitle>
										<p className="text-xs text-slate-500 font-mono">@{stylist.id}</p>
									</div>
								</div>
							</CardHeader>

							<CardContent className="grow pt-4">
								<Label className="text-xs text-slate-400 uppercase tracking-wider">Services</Label>
								<div className="flex flex-wrap gap-1.5 mt-2">
									{(stylist.service_ids || []).length === 0 ? (
										<span className="text-sm text-slate-400 italic">No services assigned</span>
									) : (
										getServiceNames(stylist.service_ids)
											.split(", ")
											.map((name) => (
												<span key={name} className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">
													{name}
												</span>
											))
									)}
								</div>
							</CardContent>

							<CardFooter className="bg-slate-50 border-t border-slate-100 gap-2">
								<Dialog open={editingStylist?.id === stylist.id} onOpenChange={(open) => !open && setEditingStylist(null)}>
									<DialogTrigger asChild>
										<Button variant="outline" size="sm" className="flex-1 bg-white hover:bg-slate-100" onClick={() => handleEditClick(stylist)}>
											<Edit2 className="w-3.5 h-3.5 mr-2" />
											Edit
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Edit Stylist</DialogTitle>
											<DialogDescription>Update profile for {stylist.name}</DialogDescription>
										</DialogHeader>
										{renderEditFormFields()}
										<DialogFooter>
											<Button variant="outline" onClick={() => setEditingStylist(null)}>
												Cancel
											</Button>
											<Button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending || !name}>
												{updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Save Changes"}
											</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>

								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700" disabled={deleteMutation.isPending && deleteMutation.variables === stylist.id}>
											{deleteMutation.isPending && deleteMutation.variables === stylist.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Delete Stylist</AlertDialogTitle>
											<AlertDialogDescription>
												Are you sure you want to delete <span className="font-semibold">{stylist.name}</span>? This will permanently remove their profile and Clerk account. This action cannot be undone.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => deleteMutation.mutate(stylist.id)}>
												Delete Stylist
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</CardFooter>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
