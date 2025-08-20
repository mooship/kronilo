import clsx from "clsx";
import type { FC } from "react";
import type { AppLayoutProps, AppMainProps } from "../../types/components";

/**
 * AppLayout
 *
 * Page-level layout wrapper that provides the outermost structure for the
 * application. It applies theme/background and an optional reduced-motion
 * toggle to control transitions.
 *
 * Props
 * @param {boolean} prefersReducedMotion - If true, transition classes are
 * omitted to honor user preference for reduced motion.
 */
export const AppLayout: FC<AppLayoutProps> = ({
	prefersReducedMotion,
	children,
}) => {
	return (
		<div
			className={clsx(
				"min-h-screen flex flex-col",
				!prefersReducedMotion && "transition-colors duration-200",
				"bg-background text-foreground",
			)}
		>
			{children}
		</div>
	);
};

/**
 * AppMain
 *
 * Layout container for the main content area. Centers content and provides
 * a card-like wrapper used by the application's primary pages. Children are
 * rendered inside a bordered, rounded container with a minimum height.
 */
export const AppMain: FC<AppMainProps> = ({ children }) => {
	return (
		<main className="flex-1 flex flex-col items-center justify-center px-2 sm:px-6 pt-0 sm:pt-2 pb-1 sm:pb-6 lg:pb-8 min-h-0 mb-1 sm:mb-0">
			<div className="w-full max-w-3xl mx-auto">
				<div
					className={clsx(
						"shadow-lg border rounded-xl sm:rounded-2xl px-2 sm:px-6 py-2 sm:py-8",
						"bg-background border-border",
					)}
					style={{ minHeight: "600px" }}
				>
					{children}
				</div>
			</div>
		</main>
	);
};
