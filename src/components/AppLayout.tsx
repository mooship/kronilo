import clsx from "clsx";
import type { FC } from "react";
import { useWindowSize } from "usehooks-ts";
import type { AppLayoutProps, AppMainProps } from "../types/components";

export const AppLayout: FC<AppLayoutProps> = ({
	prefersReducedMotion,
	children,
}) => {
	const { width } = useWindowSize();
	// Example: change background for very small screens
	const isVerySmall = width < 400;
	return (
		<div
			className={clsx(
				"min-h-screen flex flex-col",
				!prefersReducedMotion && "transition-colors duration-200",
				isVerySmall
					? "bg-yellow-50 text-black"
					: "bg-gray-50 text-black dark:bg-neutral-900 dark:text-neutral-50",
			)}
		>
			{children}
		</div>
	);
};

export const AppMain: FC<AppMainProps> = ({ children }) => {
	return (
		<main className="flex-1 flex flex-col items-center justify-center px-2 sm:px-6 pt-0 sm:pt-2 pb-1 sm:pb-6 lg:pb-8 min-h-0 mb-1 sm:mb-0">
			<div className="w-full max-w-3xl mx-auto">
				<div
					className={clsx(
						"shadow-2xl border rounded-xl sm:rounded-2xl px-2 sm:px-6 py-2 sm:py-8",
						"bg-white border-gray-200 dark:bg-neutral-800 dark:border-neutral-700",
					)}
					style={{ minHeight: "600px" }}
				>
					{children}
				</div>
			</div>
		</main>
	);
};
