export const dummyServices = [
	{
		id: "s1",
		name: "Classic Haircut",
		description: "A standard haircut tailored to your style using scissors or clippers.",
		duration_minutes: 30,
		price: 35,
	},
	{
		id: "s2",
		name: "Beard Trim & Sculpt",
		description: "Professional beard trimming, shaping, and conditioning.",
		duration_minutes: 20,
		price: 20,
	},
	{
		id: "s3",
		name: "Full Hair Coloring",
		description: "Complete hair color transformation using premium dyes.",
		duration_minutes: 120,
		price: 120,
	},
	{
		id: "s4",
		name: "Keratin Treatment",
		description: "Smoothing treatment to eliminate frizz and add shine.",
		duration_minutes: 90,
		price: 150,
	},
	{
		id: "s5",
		name: "Bridal Styling",
		description: "Elegant hair styling for your special day.",
		duration_minutes: 60,
		price: 85,
	},
	{
		id: "s6",
		name: "Scalp Massage & Wash",
		description: "Relaxing scalp massage followed by a deep cleansing wash.",
		duration_minutes: 15,
		price: 15,
	},
];

export const dummyStylists = [
	{
		id: "aarav_mehta",
		username: "aarav_mehta",
		name: "Aarav Mehta",
		password: "clipper123",
		image_url: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
		service_ids: ["s1", "s2", "s6"],
	},
	{
		id: "rohan_kapoor",
		username: "rohan_kapoor",
		name: "Rohan Kapoor",
		password: "style789",
		image_url: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
		service_ids: ["s1", "s3", "s4"],
	},
	{
		id: "neha_sharma",
		username: "neha_sharma",
		name: "Neha Sharma",
		password: "salon456",
		image_url: "https://i.pravatar.cc/150?u=a04258114e29026702d",
		service_ids: ["s1", "s5", "s6"],
	},
];
