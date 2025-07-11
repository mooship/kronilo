import { useCallback, useState } from "react";

export function usePressAnimation() {
	const [isPressed, setIsPressed] = useState(false);

	const handlePressStart = useCallback(() => setIsPressed(true), []);
	const handlePressEnd = useCallback(() => setIsPressed(false), []);

	return {
		isPressed,
		handlePressStart,
		handlePressEnd,
	};
}
