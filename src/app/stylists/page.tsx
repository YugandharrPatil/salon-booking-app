import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { TABLES } from "@/lib/tables";
import { Scissors, Star } from "lucide-react";
import Link from "next/link";

export default async function StylistsPage() {
	// Fetch all stylists
	const { data: stylists } = await supabase.from(TABLES.STYLISTS).select("id, name, image_url, service_ids").order("name", { ascending: true });

	// Fetch all services for name lookup
	const { data: services } = await supabase.from(TABLES.SERVICES).select("id, name");
	const servicesMap: Record<string, string> = {};
	(services || []).forEach((s: any) => {
		servicesMap[s.id] = s.name;
	});

	// Fetch average ratings for all stylists from appointments
	const { data: ratings } = await supabase.from(TABLES.APPOINTMENTS).select("stylist_id, rating").not("rating", "is", null);
	const ratingMap: Record<string, { total: number; count: number }> = {};
	(ratings || []).forEach((r: any) => {
		if (!ratingMap[r.stylist_id]) {
			ratingMap[r.stylist_id] = { total: 0, count: 0 };
		}
		ratingMap[r.stylist_id].total += r.rating;
		ratingMap[r.stylist_id].count += 1;
	});

	return (
		<div className="min-h-screen bg-slate-50">
			<main className="container mx-auto px-4 py-12">
				<div className="max-w-3xl mx-auto text-center mb-12">
					<h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">Our Stylists</h1>
					<p className="text-lg text-slate-600">Meet our talented team of professionals dedicated to making you look and feel amazing.</p>
				</div>

				{!stylists || stylists.length === 0 ? (
					<div className="text-center py-24 bg-white rounded-xl border border-slate-200 shadow-sm">
						<Scissors className="w-16 h-16 text-slate-200 mx-auto mb-4" />
						<h3 className="text-2xl font-bold text-slate-700 mb-2">No Stylists Yet</h3>
						<p className="text-slate-500">Our team is being assembled. Check back soon!</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{stylists.map((stylist: any) => {
							const avgRating = ratingMap[stylist.id] ? (ratingMap[stylist.id].total / ratingMap[stylist.id].count).toFixed(1) : null;
							const reviewCount = ratingMap[stylist.id]?.count || 0;
							const serviceNames = (stylist.service_ids || []).map((id: string) => servicesMap[id]).filter(Boolean);

							return (
								<Link key={stylist.id} href={`/stylists/${stylist.id}`} className="block group">
									<Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:border-blue-200">
										{/* Avatar section */}
										<div className="relative h-52 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
											{stylist.image_url ? (
												<img src={stylist.image_url} alt={stylist.name} className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300" />
											) : (
												<div className="w-28 h-28 rounded-full bg-white/80 flex items-center justify-center border-4 border-white shadow-lg">
													<Scissors className="w-10 h-10 text-slate-300" />
												</div>
											)}
											{/* Rating badge */}
											{avgRating && (
												<div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm border border-slate-100">
													<Star className="w-4 h-4 text-amber-500 fill-amber-500" />
													<span className="text-sm font-bold text-slate-800">{avgRating}</span>
												</div>
											)}
										</div>

										<CardHeader className="text-center pb-2">
											<h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{stylist.name}</h3>
											<p className="text-sm text-slate-500 font-mono">@{stylist.id}</p>
										</CardHeader>

										<CardContent className="grow space-y-3 pt-0">
											{/* Services */}
											{serviceNames.length > 0 && (
												<div className="flex flex-wrap gap-1.5 justify-center">
													{serviceNames.slice(0, 3).map((name: string) => (
														<span key={name} className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">
															{name}
														</span>
													))}
													{serviceNames.length > 3 && <span className="bg-slate-100 text-slate-500 text-xs px-2.5 py-1 rounded-full font-medium">+{serviceNames.length - 3}</span>}
												</div>
											)}

											{/* Reviews count */}
											<div className="text-center">
												{reviewCount > 0 ? (
													<p className="text-sm text-slate-500">
														{reviewCount} review{reviewCount !== 1 ? "s" : ""}
													</p>
												) : (
													<p className="text-sm text-slate-400 italic">No reviews yet</p>
												)}
											</div>
										</CardContent>
									</Card>
								</Link>
							);
						})}
					</div>
				)}
			</main>
		</div>
	);
}
