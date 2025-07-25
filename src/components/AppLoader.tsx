import clsx from "clsx";
import { memo } from "react";
import { useWindowSize } from "usehooks-ts";

const AppLoader = () => {
	const { width } = useWindowSize();
	const loaderSize = width < 400 ? "w-8 h-8" : "w-12 h-12";
	return (
		<div
			className={clsx(
				"min-h-screen flex flex-col",
				"bg-gray-50 text-black",
				"dark:bg-neutral-900 dark:text-neutral-50",
			)}
		>
			<div className="flex-1 flex flex-col items-center justify-center px-2 sm:px-6">
				<div className="w-full max-w-2xl mx-auto animate-fade-in">
					<div
						className={clsx(
							"shadow-2xl border flex flex-col items-center justify-center",
							"rounded-xl sm:rounded-2xl px-2 sm:px-6 py-2 sm:py-8",
							"bg-white border-gray-200",
							"dark:bg-neutral-800 dark:border-neutral-700",
						)}
						style={{
							minHeight: "600px",
							animation: "fadeInScale 0.5s cubic-bezier(0.4,0,0.2,1)",
						}}
					>
						<div className="relative mb-6">
							<div
								className={clsx(
									loaderSize,
									"border-4 rounded-full animate-spin",
									"border-gray-200 border-t-black",
									"dark:border-neutral-600 dark:border-t-white",
								)}
							></div>
						</div>
						<div className="text-center">
							<h2
								className={clsx(
									"font-bold mb-2",
									"text-xl sm:text-2xl md:text-3xl",
									"text-black",
									"dark:text-neutral-50",
								)}
							>
								Kronilo
							</h2>
							<p
								className={clsx(
									"text-base sm:text-lg",
									"text-black opacity-70",
									"dark:text-neutral-50 dark:opacity-70",
								)}
							>
								Loading...
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export const MemoizedAppLoader = memo(AppLoader);
