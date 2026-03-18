import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Scissors, Star } from "lucide-react";
import Link from "next/link";

export default function Home() {
	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1">
				{/* Hero Section */}
				<section className="relative py-20 overflow-hidden z-0">
					<div className="absolute inset-0 bg-linear-to-br from-slate-900 to-slate-400 -z-10" />
					<div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay -z-10" />

					<div className="container mx-auto px-4 flex flex-col items-center text-center">
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 backdrop-blur-sm text-sm font-medium mb-8">
							<Star className="w-4 h-4 text-yellow-400 fill-current" />
							<span>Experience premium grooming</span>
						</div>

						<h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 max-w-4xl">
							Elevate Your Style with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">LuxeSalon</span>
						</h1>

						<p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed">Book your next appointment effortlessly. Discover top-rated stylists, modern trends, and a seamless booking experience tailored to you.</p>

						<div className="flex items-center gap-4">
							<Button asChild size="lg" className="h-14 px-8 text-base bg-white text-slate-900 hover:bg-slate-100 transition-colors">
								<Link href="/services">
									Book an Appointment <ArrowRight className="ml-2 w-5 h-5" />
								</Link>
							</Button>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section className="py-24 bg-white">
					<div className="container mx-auto px-4">
						<div className="text-center mb-16">
							<h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Us</h2>
							<p className="text-slate-600 max-w-2xl mx-auto">Experience the perfect blend of modern convenience and traditional expertise.</p>
						</div>

						<div className="grid md:grid-cols-3 gap-8">
							<div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition-shadow">
								<div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
									<Scissors className="w-6 h-6" />
								</div>
								<h3 className="text-xl font-semibold mb-3">Expert Stylists</h3>
								<p className="text-slate-600 text-sm leading-relaxed">Our team of professional stylists are trained in the latest techniques to deliver exactly the look you want.</p>
							</div>

							<div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition-shadow">
								<div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
									<Calendar className="w-6 h-6" />
								</div>
								<h3 className="text-xl font-semibold mb-3">Easy Booking</h3>
								<p className="text-slate-600 text-sm leading-relaxed">Schedule your next visit in seconds with our seamless online booking platform. Available 24/7.</p>
							</div>

							<div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition-shadow">
								<div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
									<Star className="w-6 h-6" />
								</div>
								<h3 className="text-xl font-semibold mb-3">Premium Service</h3>
								<p className="text-slate-600 text-sm leading-relaxed">Enjoy a relaxing atmosphere and complimentary beverages during your luxurious salon experience.</p>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
