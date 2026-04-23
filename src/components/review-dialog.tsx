"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitStylistReview } from "@/lib/actions/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Star } from "lucide-react";
import { useState } from "react";

type ReviewDialogProps = {
	appointmentId: string;
	stylistId?: string;
	stylistName: string;
	isOpen: boolean;
	onClose: () => void;
};

export default function ReviewDialog({ appointmentId, stylistName, isOpen, onClose }: ReviewDialogProps) {
	const [rating, setRating] = useState<number>(5);
	const [review, setReview] = useState<string>("");
	const queryClient = useQueryClient();

	const reviewMutation = useMutation({
		mutationFn: async () => {
			await submitStylistReview(appointmentId, rating, review);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["client-appointments"] });
			onClose();
			// Reset for next time
			setRating(5);
			setReview("");
		},
		onError: (error) => {
			console.error("Failed to submit review:", error);
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		reviewMutation.mutate();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-106.25 ">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Leave a Review</DialogTitle>
						<DialogDescription>
							How was your experience with <strong>{stylistName}</strong>? Your feedback helps them improve!
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-6 py-6">
						<div className="flex flex-col items-center gap-3">
							<Label className="text-sm font-semibold text-slate-700">Tap to rate</Label>
							<div className="flex gap-1">
								{[1, 2, 3, 4, 5].map((star) => (
									<button key={star} type="button" onClick={() => setRating(star)} className={`p-1 transition-all ${rating >= star ? "text-amber-400 hover:text-amber-500 hover:scale-110" : "text-slate-200 hover:text-slate-300 hover:scale-110"}`}>
										<Star className="w-10 h-10 fill-current" />
									</button>
								))}
							</div>
							<p className="text-xs font-medium text-slate-500">{rating === 5 ? "Excellent!" : rating === 4 ? "Great" : rating === 3 ? "Good" : rating === 2 ? "Fair" : "Poor"}</p>
						</div>

						<div className="space-y-3">
							<Label htmlFor="review" className="text-sm font-semibold text-slate-700">
								Written Review (Optional)
							</Label>
							<Textarea id="review" placeholder="What did you love about your appointment?" className="resize-none h-24 bg-slate-50 focus:bg-white" value={review} onChange={(e) => setReview(e.target.value)} disabled={reviewMutation.isPending} />
						</div>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose} disabled={reviewMutation.isPending}>
							Cancel
						</Button>
						<Button type="submit" disabled={reviewMutation.isPending}>
							{reviewMutation.isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Submitting...
								</>
							) : (
								"Submit Review"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
