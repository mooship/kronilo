import clsx from "clsx";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useWindowSize } from "usehooks-ts";
import { usePressAnimation } from "../hooks/usePressAnimation";

export const NotFoundCard: FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { isPressed, handlePressStart, handlePressEnd } = usePressAnimation();
	const { width } = useWindowSize();
	const isSmallScreen = width < 640;

	return (
		<div
			className={clsx(
				"flex w-full flex-col items-center justify-center px-4 py-24",
				"max-w-2xl mx-auto",
				"animate-fade-in",
			)}
			style={{ animation: "fadeInScale 0.5s cubic-bezier(0.4,0,0.2,1)" }}
		>
			<h1
				className={clsx(
					"mb-2 font-bold",
					isSmallScreen ? "text-3xl" : "text-3xl sm:text-5xl",
					"text-black dark:text-neutral-50",
				)}
			>
				{t("notFound.title")}
			</h1>
			<p
				className={clsx(
					"mb-8 text-black opacity-80 dark:text-neutral-50 dark:opacity-80",
					isSmallScreen ? "text-base" : "text-base sm:text-lg",
				)}
			>
				{t("notFound.message")}
			</p>
			<button
				type="button"
				aria-label={t("notFound.goHome")}
				onMouseDown={handlePressStart}
				onMouseUp={handlePressEnd}
				onMouseLeave={handlePressEnd}
				onTouchStart={handlePressStart}
				onTouchEnd={handlePressEnd}
				onClick={() => navigate("/")}
				className={clsx(
					"rounded-xl bg-neutral-900 px-6 py-3 font-medium text-neutral-50 shadow-xl transition-all duration-200 hover:bg-neutral-800 focus:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400 active:scale-95 dark:bg-gray-100 dark:text-black dark:focus:bg-gray-200 dark:focus:ring-gray-600 dark:hover:bg-gray-200",
					"focus:shadow-lg focus:shadow-primary/30",
					isSmallScreen ? "text-base" : "text-base sm:text-lg",
					isPressed && "scale-95 bg-neutral-800 dark:bg-gray-200",
				)}
			>
				{t("notFound.goHome")}
			</button>
			<style>{`
			@keyframes fadeInScale {
				0% { opacity: 0; transform: scale(0.96); }
				100% { opacity: 1; transform: scale(1); }
			}
			.animate-fade-in {
				animation: fadeInScale 0.5s cubic-bezier(0.4,0,0.2,1);
			}
			`}</style>
		</div>
	);
};
