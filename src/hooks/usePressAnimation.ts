import { useCallback, useState } from "react";
import type { UsePressAnimation } from "../types/hooks";

export function usePressAnimation(): UsePressAnimation {
	const [isPressed, setIsPressed] = useState(false);

	const handlePressStart = useCallback(() => setIsPressed(true), []);
	const handlePressEnd = useCallback(() => setIsPressed(false), []);

	return {
		isPressed,
		handlePressStart,
		handlePressEnd,
	};
}
