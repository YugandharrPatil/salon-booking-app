"use client";

import { createService, deleteService, updateService } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { TABLES } from "@/lib/tables";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock, Edit2, Loader2, Plus, Scissors, Trash2 } from "lucide-react";
import { useState } from "react";

export interface Service {
	id: string;
	name: string;
	description: string | null;
	duration_minutes: number;
	price: number;
	image_url: string | null;
}

export function AdminServicesList() {
	const queryClient = useQueryClient();
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [editingService, setEditingService] = useState<Service | null>(null);

	// Form State
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [durationMinutes, setDurationMinutes] = useState(30);
	const [price, setPrice] = useState(0);
	const [imageUrl, setImageUrl] = useState("");

	const {
		data: services,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["admin-services"],
		queryFn: async () => {
			const { data, error } = await supabase.from(TABLES.SERVICES).select("*").order("name", { ascending: true });
			if (error && error.code !== "PGRST116") throw error;
			return data as Service[];
		},
	});

	const createMutation = useMutation({
		mutationFn: async () => {
			await createService({
				name,
				description: description || null,
				duration_minutes: durationMinutes,
				price,
				image_url: imageUrl || null,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-services"] });
			setIsCreateOpen(false);
			resetForm();
		},
	});

	const updateMutation = useMutation({
		mutationFn: async () => {
			if (!editingService) return;
			await updateService(editingService.id, {
				name,
				description: description || null,
				duration_minutes: durationMinutes,
				price,
				image_url: imageUrl || null,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-services"] });
			setEditingService(null);
			resetForm();
		},
	});

	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			await deleteService(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-services"] });
		},
	});

	const resetForm = () => {
		setName("");
		setDescription("");
		setDurationMinutes(30);
		setPrice(0);
		setImageUrl("");
	};

	const handleEditClick = (service: Service) => {
		setEditingService(service);
		setName(service.name);
		setDescription(service.description || "");
		setDurationMinutes(service.duration_minutes);
		setPrice(service.price);
		setImageUrl(service.image_url || "");
	};

	if (isLoading) {
		return (
			<div className="flex flex-col justify-center items-center py-32 text-slate-500 bg-white rounded-xl border border-slate-200">
				<Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
				<span className="text-lg font-medium">Loading services directory...</span>
			</div>
		);
	}

	if (error) {
		return <div className="text-center py-10 bg-red-50 text-red-600 rounded-xl border border-red-200">Failed to load services. Please check your connection.</div>;
	}

	// Service Form fields extracted to avoid nested component declarations
	const renderServiceFormFields = () => (
		<div className="grid gap-4 py-4">
			<div className="grid gap-2">
				<Label htmlFor="name">Service Name</Label>
				<Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Master Haircut" required />
			</div>
			<div className="grid grid-cols-2 gap-4">
				<div className="grid gap-2">
					<Label htmlFor="price">Price ($)</Label>
					<Input id="price" type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} required />
				</div>
				<div className="grid gap-2">
					<Label htmlFor="duration">Duration (mins)</Label>
					<Input id="duration" type="number" step="15" min="15" value={durationMinutes} onChange={(e) => setDurationMinutes(parseInt(e.target.value))} required />
				</div>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="description">Description (Optional)</Label>
				<Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of what the service entails..." className="resize-none" />
			</div>
			<div className="grid gap-2">
				<Label htmlFor="imageUrl">Image URL (Optional)</Label>
				<Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
			</div>
		</div>
	);

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
				<div>
					<h2 className="text-2xl font-bold text-slate-800">Service Categories</h2>
					<p className="text-slate-500 text-sm mt-1">Manage the booking catalog available to clients.</p>
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
							<Plus className="w-4 h-4 mr-2" />
							New Service
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Create New Service</DialogTitle>
							<DialogDescription>Add a new offering to the salon catalog.</DialogDescription>
						</DialogHeader>
						{renderServiceFormFields()}
						<DialogFooter>
							<Button variant="outline" onClick={() => setIsCreateOpen(false)}>
								Cancel
							</Button>
							<Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !name || price < 0 || durationMinutes < 1}>
								{createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Save Service"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			{!services || services.length === 0 ? (
				<div className="text-center py-24 bg-white rounded-xl border border-slate-200 shadow-sm">
					<Scissors className="w-16 h-16 text-slate-200 mx-auto mb-4" />
					<h3 className="text-xl font-bold text-slate-700 mb-2">No Services Configured</h3>
					<p className="text-slate-500 max-w-sm mx-auto">Create your first service offering to allow clients to start booking appointments.</p>
				</div>
			) : (
				<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
					{services.map((service) => (
						<Card key={service.id} className="flex flex-col overflow-hidden hover:shadow-md transition-shadow">
							{service.image_url ? (
								<div className="h-48 w-full bg-slate-100 relative">
									<img src={service.image_url} alt={service.name} className="w-full h-full object-cover" />
									<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
										<h3 className="text-xl font-bold text-white shadow-sm">{service.name}</h3>
									</div>
								</div>
							) : (
								<CardHeader className="bg-slate-50 pb-4 border-b border-slate-100">
									<CardTitle className="text-xl">{service.name}</CardTitle>
								</CardHeader>
							)}

							<CardContent className="flex-grow pt-4">
								<p className="text-slate-600 text-sm line-clamp-2 min-h-[40px] mb-4">{service.description || "No description provided."}</p>

								<div className="flex items-center justify-between text-sm">
									<div className="flex items-center text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg font-medium">
										<Clock className="w-4 h-4 mr-2 text-slate-500" />
										{service.duration_minutes} mins
									</div>
									<div className="text-lg font-bold text-emerald-600">${Number(service.price).toFixed(2)}</div>
								</div>
							</CardContent>

							<CardFooter className="bg-slate-50 border-t border-slate-100 gap-2 focus-within:ring-0">
								<Dialog open={editingService?.id === service.id} onOpenChange={(open) => !open && setEditingService(null)}>
									<DialogTrigger asChild>
										<Button variant="outline" size="sm" className="flex-1 bg-white hover:bg-slate-100" onClick={() => handleEditClick(service)}>
											<Edit2 className="w-3.5 h-3.5 mr-2" />
											Edit
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Edit Service</DialogTitle>
											<DialogDescription>Modify details for {service.name}</DialogDescription>
										</DialogHeader>
										{renderServiceFormFields()}
										<DialogFooter>
											<Button variant="outline" onClick={() => setEditingService(null)}>
												Cancel
											</Button>
											<Button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending || !name || price < 0 || durationMinutes < 1}>
												{updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Save Changes"}
											</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>

								<Button
									variant="ghost"
									size="sm"
									className="text-red-600 hover:bg-red-50 hover:text-red-700"
									onClick={() => {
										if (confirm("Are you sure you want to delete this service? This cannot be undone.")) {
											deleteMutation.mutate(service.id);
										}
									}}
									disabled={deleteMutation.isPending && deleteMutation.variables === service.id}
								>
									{deleteMutation.isPending && deleteMutation.variables === service.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
