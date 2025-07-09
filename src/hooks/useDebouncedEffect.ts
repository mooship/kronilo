import { useEffect, useRef } from "react";

export function useDebouncedEffect(
	effect: () => (() => void) | undefined,
	deps: unknown[],
	delay: number,
) {
	const cleanup = useRef<(() => void) | undefined>(undefined);

	useEffect(() => {
		const handler = setTimeout(() => {
			cleanup.current = effect();
		}, delay);
		return () => {
			clearTimeout(handler);
			if (typeof cleanup.current === "function") {
				cleanup.current();
			}
		};
	}, [...deps, effect, delay]);
}
