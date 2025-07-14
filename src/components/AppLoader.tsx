/**
 * Displays a loading screen while the app is loading.
 */
export function AppLoader() {
	return (
		<div className="min-h-screen flex flex-col bg-gray-50 text-black dark:bg-neutral-900 dark:text-neutral-50">
			<div className="flex-1 flex flex-col items-center justify-center px-2 sm:px-6">
				<div className="w-full max-w-3xl mx-auto">
					<div
						className="shadow-2xl border rounded-xl sm:rounded-2xl px-2 sm:px-6 py-2 sm:py-8 bg-white border-gray-200 dark:bg-neutral-800 dark:border-neutral-700 flex flex-col items-center justify-center"
						style={{ minHeight: "600px" }}
					>
						<div className="relative mb-6">
							<div className="w-12 h-12 border-4 border-gray-200 dark:border-neutral-600 rounded-full animate-spin border-t-black dark:border-t-white"></div>
						</div>
						<div className="text-center">
							<h2 className="text-2xl sm:text-3xl font-bold mb-2 text-black dark:text-neutral-50">
								Kronilo
							</h2>
							<p className="text-base sm:text-lg text-black opacity-70 dark:text-neutral-50 dark:opacity-70">
								Loading...
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
