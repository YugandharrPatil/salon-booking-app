import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, DollarSign } from "lucide-react";
import Link from "next/link";

import { Tables } from "@/types/database.types";

type Service = Tables<"salon_services">;

type ServiceProps = {
	service: Service;
};

export function ServiceCard({ service }: ServiceProps) {
	return (
		<Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
			{service.image_url ? (
				<div className="h-48 w-full bg-slate-100 relative">
					<img src={service.image_url} alt={service.name} className="w-full h-full object-cover" />
					<div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-4">
						<h3 className="text-xl font-bold text-white shadow-sm">{service.name}</h3>
					</div>
				</div>
			) : (
				<CardHeader>
					<CardTitle className="text-xl">{service.name}</CardTitle>
					<CardDescription className="line-clamp-2">{service.description}</CardDescription>
				</CardHeader>
			)}
			<CardContent className={service.image_url ? "flex-grow pt-4" : "flex-grow"}>
				{service.image_url && <CardDescription className="line-clamp-2 mb-4">{service.description}</CardDescription>}
				<div className="flex flex-col gap-2 text-sm text-muted-foreground">
					<div className="flex items-center gap-2">
						<Clock className="w-4 h-4" />
						<span>{service.duration_minutes} mins</span>
					</div>
					<div className="flex items-center gap-2">
						<DollarSign className="w-4 h-4" />
						<span>${service.price.toFixed(2)}</span>
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<Button asChild className="w-full">
					<Link href={`/services/${service.id}/book`}>Book Now</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
