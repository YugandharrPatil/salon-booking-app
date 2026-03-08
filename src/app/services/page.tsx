import { ServiceCard } from "@/components/ServiceCard";
import { supabase } from "@/lib/supabase";

export default async function ServicesPage() {
	const { data: services } = await supabase.from("services").select("*").order("name", { ascending: true });

	return (
		<div className="min-h-screen bg-slate-50">
			<main className="container mx-auto px-4 py-12">
				<div className="max-w-3xl mx-auto text-center mb-12">
					<h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">Our Services</h1>
					<p className="text-lg text-slate-600">Choose from our wide range of professional salon services designed to make you look and feel your best.</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{services?.map((service) => (
						<ServiceCard key={service.id} service={service} />
					))}
				</div>
			</main>
		</div>
	);
}
