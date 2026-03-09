import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { TABLES } from "@/lib/tables";
import { ChevronLeft, MessageSquare, Scissors, Star } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function StylistProfilePage({ params }: { params: { id: string } }) {
	const { id } = await params;

	// Fetch stylist
	const { data: stylist, error } = await supabase.from(TABLES.STYLISTS).select("id, name, image_url, service_ids").eq("id", id).single();

	if (error || !stylist) {
		notFound();
	}

	// Fetch services for this stylist
	const { data: allServices } = await supabase.from(TABLES.SERVICES).select("id, name");
	const servicesMap: Record<string, string> = {};
	(allServices || []).forEach((s: any) => {
		servicesMap[s.id] = s.name;
	});
	const stylistServices = (stylist.service_ids || []).map((sid: string) => servicesMap[sid]).filter(Boolean);

	// Fetch all reviews for this stylist (appointments with a rating)
	const { data: reviews } = await supabase.from(TABLES.APPOINTMENTS).select("id, rating, review, customer_name, date, service_id").eq("stylist_id", id).not("rating", "is", null).order("date", { ascending: false });

	// Calculate average rating
	const totalRating = (reviews || []).reduce((sum: number, r: any) => sum + (r.rating || 0), 0);
	const reviewCount = (reviews || []).length;
	const avgRating = reviewCount > 0 ? totalRating / reviewCount : 0;

	// Star rendering helper
	const renderStars = (rating: number, size: string = "w-4 h-4") => {
		return Array.from({ length: 5 }, (_, i) => <Star key={i} className={`${size} ${i < rating ? "text-amber-500 fill-amber-500" : "text-slate-200"}`} />);
	};

	return (
		<div className="min-h-screen bg-slate-50">
			<main className="container mx-auto px-4 py-12 max-w-4xl">
				{/* Back link */}
				<Link href="/stylists" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-8">
					<ChevronLeft className="w-4 h-4 mr-1" />
					Back to Stylists
				</Link>

				{/* Stylist Profile Header */}
				<Card className="overflow-hidden mb-8">
					<div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-12 pb-16 flex flex-col items-center">
						{stylist.image_url ? (
							<img src={stylist.image_url} alt={stylist.name} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl" />
						) : (
							<div className="w-32 h-32 rounded-full bg-white/80 flex items-center justify-center border-4 border-white shadow-xl">
								<Scissors className="w-12 h-12 text-slate-300" />
							</div>
						)}
						<h1 className="text-3xl font-bold text-slate-800 mt-5">{stylist.name}</h1>
						<p className="text-slate-500 font-mono text-sm mt-1">@{stylist.id}</p>

						{/* Average rating */}
						{reviewCount > 0 && (
							<div className="flex items-center gap-2 mt-4 bg-white/80 backdrop-blur-sm rounded-full px-5 py-2.5 shadow-sm border border-slate-100">
								<div className="flex">{renderStars(Math.round(avgRating), "w-5 h-5")}</div>
								<span className="text-lg font-bold text-slate-800">{avgRating.toFixed(1)}</span>
								<span className="text-sm text-slate-500">
									({reviewCount} review{reviewCount !== 1 ? "s" : ""})
								</span>
							</div>
						)}
					</div>

					{/* Services */}
					{stylistServices.length > 0 && (
						<CardContent className="py-6 border-t border-slate-100">
							<h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Services Offered</h2>
							<div className="flex flex-wrap gap-2">
								{stylistServices.map((name: string) => (
									<span key={name} className="bg-blue-50 text-blue-700 text-sm px-3.5 py-1.5 rounded-full font-medium">
										{name}
									</span>
								))}
							</div>
						</CardContent>
					)}
				</Card>

				{/* Reviews Section */}
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<h2 className="text-2xl font-bold text-slate-800">Reviews</h2>
						{reviewCount > 0 && <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">{reviewCount} total</span>}
					</div>

					{!reviews || reviews.length === 0 ? (
						<Card className="border-dashed">
							<CardContent className="py-16 text-center">
								<MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
								<h3 className="text-xl font-semibold text-slate-600 mb-2">No Reviews Yet</h3>
								<p className="text-slate-400 max-w-sm mx-auto">This stylist hasn&apos;t received any reviews yet. Be the first to share your experience!</p>
							</CardContent>
						</Card>
					) : (
						<div className="grid gap-4">
							{reviews.map((review: any) => {
								const serviceName = servicesMap[review.service_id] || "Service";
								return (
									<Card key={review.id} className="hover:shadow-sm transition-shadow">
										<CardHeader className="pb-3">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold text-sm">{(review.customer_name || "?")[0].toUpperCase()}</div>
													<div>
														<CardTitle className="text-base">{review.customer_name || "Anonymous"}</CardTitle>
														<p className="text-xs text-slate-400 mt-0.5">
															{new Date(review.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
															{" · "}
															<span className="text-blue-600">{serviceName}</span>
														</p>
													</div>
												</div>
												<div className="flex items-center gap-1">{renderStars(review.rating)}</div>
											</div>
										</CardHeader>
										{review.review && (
											<CardContent className="pt-0">
												<p className="text-slate-600 text-sm leading-relaxed">{review.review}</p>
											</CardContent>
										)}
									</Card>
								);
							})}
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
