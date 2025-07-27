import { useState } from "react";
import type { UsePressAnimation } from "../types/hooks";

/**
 * React hook for managing a press animation state (e.g., button press effect).
 *
 * @returns {UsePressAnimation} Press state and handlers
 */
export function usePressAnimation(): UsePressAnimation {
	const [isPressed, setIsPressed] = useState(false);
	return {
		isPressed,
		/** Set pressed state to true (on press start) */
		handlePressStart: () => setIsPressed(true),
		/** Set pressed state to false (on press end) */
		handlePressEnd: () => setIsPressed(false),
	};
}
