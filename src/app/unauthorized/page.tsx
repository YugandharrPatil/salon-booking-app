export default function UnauthorizedPage() {
	return (
		<div className="min-h-screen bg-slate-50 flex flex-col">
			<main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
				<div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
					<div>
						<h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Unauthorized</h1>
						<p className="text-slate-500 mt-1">You do not have permission to access this page.</p>
					</div>
				</div>
			</main>
		</div>
	);
}
