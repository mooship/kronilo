import clsx from "clsx";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { usePressAnimation } from "../hooks/usePressAnimation";

export const NotFoundCard: FC = () => {
	const navigate = useNavigate();
	const { isPressed, handlePressStart, handlePressEnd } = usePressAnimation();

	return (
		<div className="flex flex-col items-center justify-center w-full py-24 px-4">
			<h1 className="text-5xl font-bold mb-2 text-black">404</h1>
			<p className="text-lg mb-8 text-black opacity-80">Page Not Found</p>
			<button
				type="button"
				onMouseDown={handlePressStart}
				onMouseUp={handlePressEnd}
				onMouseLeave={handlePressEnd}
				onTouchStart={handlePressStart}
				onTouchEnd={handlePressEnd}
				onClick={() => navigate("/")}
				className={clsx(
					"px-6 py-3 rounded-xl font-medium text-base text-white bg-gray-900 shadow-xl transition-all duration-200 hover:bg-gray-800 focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 active:scale-95",
					isPressed && "scale-95 bg-gray-800",
				)}
			>
				Go Home
			</button>
		</div>
	);
};
