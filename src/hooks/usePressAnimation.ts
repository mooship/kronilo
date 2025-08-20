import { useState } from "react";
import type { UsePressAnimation } from "../types/hooks";

/**
 * usePressAnimation
 *
 * Minimal hook that tracks a pressed state for touch/mouse interactions. It
 * is intended for small, local press animations on buttons (scale/visual
 * feedback). Returns handlers that can be wired to mouse/touch events.
 *
 * @returns {{ isPressed: boolean, handlePressStart: () => void, handlePressEnd: () => void }}
 */
export function usePressAnimation(): UsePressAnimation {
	const [isPressed, setIsPressed] = useState(false);
	return {
		isPressed,
		handlePressStart: () => setIsPressed(true),
		handlePressEnd: () => setIsPressed(false),
	};
}
