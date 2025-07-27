import { useEffect } from "react";

/**
 * Calls the provided handler when a click occurs outside the referenced element.
 * @param ref React ref to the element to detect outside clicks for
 * @param handler Function to call on outside click
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
	ref: React.RefObject<T>,
	handler: (event: MouseEvent | TouchEvent) => void,
) {
	useEffect(() => {
		function listener(event: MouseEvent | TouchEvent) {
			if (!ref.current || ref.current.contains(event.target as Node)) {
				return;
			}
			handler(event);
		}
		document.addEventListener("mousedown", listener);
		document.addEventListener("touchstart", listener);
		return () => {
			document.removeEventListener("mousedown", listener);
			document.removeEventListener("touchstart", listener);
		};
	}, [ref, handler]);
}
