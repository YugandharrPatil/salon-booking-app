import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, DollarSign } from "lucide-react";
import Link from "next/link";

interface ServiceProps {
	service: {
		id: string;
		name: string;
		description: string;
		duration_minutes: number;
		price: number;
	};
}

export function ServiceCard({ service }: ServiceProps) {
	return (
		<Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
			<CardHeader>
				<CardTitle className="text-xl">{service.name}</CardTitle>
				<CardDescription className="line-clamp-2">{service.description}</CardDescription>
			</CardHeader>
			<CardContent className="flex-grow">
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
