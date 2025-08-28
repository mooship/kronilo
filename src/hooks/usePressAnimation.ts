import { useState } from "react";
import type { UsePressAnimation } from "../types/hooks";

export function usePressAnimation(): UsePressAnimation {
	const [isPressed, setIsPressed] = useState(false);
	return {
		isPressed,
		handlePressStart: () => setIsPressed(true),
		handlePressEnd: () => setIsPressed(false),
	};
}
