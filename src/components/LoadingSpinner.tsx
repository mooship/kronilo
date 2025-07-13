import type { FC } from "react";
import type { LoadingSpinnerProps } from "../types/components";

/**
 * A polished loading spinner component that matches the app's design system.
 * Features a dual-ring animation with proper dark/light theme support.
 *
 * @param props - The component props
 * @param props.message - Custom loading message (defaults to "Loading...")
 * @param props.minHeight - Custom minimum height for the container (defaults to "400px")
 *
 * @example
 * ```tsx
 * import { LoadingSpinner } from './components/LoadingSpinner';
 *
 * // Basic usage
 * <LoadingSpinner />
 *
 * // With custom message
 * <LoadingSpinner message="Translating cron expression..." />
 *
 * // With custom height
 * <LoadingSpinner minHeight="200px" />
 * ```
 */
export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
	message = "Loading...",
	minHeight = "400px",
}) => {
	return (
		<div className="flex items-center justify-center" style={{ minHeight }}>
			<div className="flex flex-col items-center gap-4">
				<div className="relative">
					<div className="w-12 h-12 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin dark:border-neutral-700 dark:border-t-neutral-300"></div>
					<div
						className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-gray-400 rounded-full animate-spin dark:border-r-neutral-500"
						style={{ animationDelay: "0.15s", animationDirection: "reverse" }}
					></div>
				</div>
				<p className="text-gray-600 dark:text-neutral-400 font-medium">
					{message}
				</p>
			</div>
		</div>
	);
};
