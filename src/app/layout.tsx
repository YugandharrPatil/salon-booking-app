import Navbar from "@/components/navbar";
import { Providers } from "@/components/providers";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Salon Booking",
	description: "Book your next appointment online",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body className={`${inter.variable} font-sans antialiased`}>
					<Providers>
						<Navbar />
						{children}
					</Providers>
				</body>
			</html>
		</ClerkProvider>
	);
}
