import clsx from "clsx";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { usePressAnimation } from "../hooks/usePressAnimation";

/**
 * Component displayed when users navigate to a non-existent route.
 * Provides a user-friendly 404 error page with navigation back to the home page.
 * Features press animation effects and accessibility support.
 *
 * @returns JSX element containing the 404 error page
 *
 * @example
 * ```tsx
 * <Route path="*" element={<NotFoundCard />} />
 * ```
 */
export const NotFoundCard: FC = () => {
	const navigate = useNavigate();
	const { isPressed, handlePressStart, handlePressEnd } = usePressAnimation();

	return (
		<div className="flex flex-col items-center justify-center w-full py-24 px-4">
			<h1 className="text-5xl font-bold mb-2 text-black dark:text-neutral-50">
				404
			</h1>
			<p className="text-lg mb-8 text-black opacity-80 dark:text-neutral-50 dark:opacity-80">
				Page Not Found
			</p>
			<button
				type="button"
				onMouseDown={handlePressStart}
				onMouseUp={handlePressEnd}
				onMouseLeave={handlePressEnd}
				onTouchStart={handlePressStart}
				onTouchEnd={handlePressEnd}
				onClick={() => navigate("/")}
				className={clsx(
					"px-6 py-3 rounded-xl font-medium text-base text-neutral-50 bg-neutral-900 shadow-xl transition-all duration-200 hover:bg-neutral-800 focus:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400 active:scale-95 dark:bg-gray-100 dark:text-black dark:hover:bg-gray-200 dark:focus:bg-gray-200 dark:focus:ring-gray-600",
					isPressed && "scale-95 bg-neutral-800 dark:bg-gray-200",
				)}
			>
				Go Home
			</button>
		</div>
	);
};
