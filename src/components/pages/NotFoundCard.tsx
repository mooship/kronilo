import clsx from "clsx";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useWindowSize } from "usehooks-ts";
import { usePressAnimation } from "../../hooks/usePressAnimation";

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
					"text-foreground",
				)}
			>
				{t("notFound.title", "404")}
			</h1>
			<p
				className={clsx(
					"mb-8 text-foreground opacity-80",
					isSmallScreen ? "text-base" : "text-base sm:text-lg",
				)}
			>
				{t("notFound.message", "Page Not Found")}
			</p>
			<button
				type="button"
				aria-label={t("notFound.goHome", "Go to Home")}
				onMouseDown={handlePressStart}
				onMouseUp={handlePressEnd}
				onMouseLeave={handlePressEnd}
				onTouchStart={handlePressStart}
				onTouchEnd={handlePressEnd}
				onClick={() => navigate("/")}
				className={clsx(
					"rounded-xl bg-blue-9 px-6 py-3 font-medium text-white shadow-xl transition-all duration-200 hover:bg-blue-10 focus:bg-blue-10 focus:outline-none focus:ring-2 focus:ring-blue-8 focus:ring-offset-background active:scale-95",
					"focus:shadow-lg focus:shadow-blue-8/30",
					isSmallScreen ? "text-base" : "text-base sm:text-lg",
					isPressed && "scale-95 bg-blue-10",
				)}
			>
				{t("notFound.goHome", "Go to Home")}
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
