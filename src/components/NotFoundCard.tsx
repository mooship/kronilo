import clsx from "clsx";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
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
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { isPressed, handlePressStart, handlePressEnd } = usePressAnimation();

	return (
		<div className="flex w-full flex-col items-center justify-center px-4 py-24">
			<h1 className="mb-2 font-bold text-5xl text-black dark:text-neutral-50">
				{t("notFound.title")}
			</h1>
			<p className="mb-8 text-black text-lg opacity-80 dark:text-neutral-50 dark:opacity-80">
				{t("notFound.message")}
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
					"rounded-xl bg-neutral-900 px-6 py-3 font-medium text-base text-neutral-50 shadow-xl transition-all duration-200 hover:bg-neutral-800 focus:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400 active:scale-95 dark:bg-gray-100 dark:text-black dark:focus:bg-gray-200 dark:focus:ring-gray-600 dark:hover:bg-gray-200",
					isPressed && "scale-95 bg-neutral-800 dark:bg-gray-200",
				)}
			>
				{t("notFound.goHome")}
			</button>
		</div>
	);
};
