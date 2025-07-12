import { useCallback, useState } from "react";
import type { UsePressAnimation } from "../types/hooks";

/**
 * Custom hook for handling press animation effects on interactive elements.
 * Provides state and handlers for creating visual feedback when buttons or elements are pressed.
 *
 * @returns Object containing press state and event handlers
 *
 * @example
 * ```typescript
 * const { isPressed, handlePressStart, handlePressEnd } = usePressAnimation();
 *
 * <button
 *   className={isPressed ? "scale-95" : ""}
 *   onMouseDown={handlePressStart}
 *   onMouseUp={handlePressEnd}
 *   onMouseLeave={handlePressEnd}
 * >
 *   Click me
 * </button>
 * ```
 */
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
