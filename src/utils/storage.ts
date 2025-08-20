/**
 * getItem
 *
 * Safe wrapper around `localStorage.getItem` that returns `null` when access
 * is not available (for example during SSR or when blocked by the browser).
 */
export function getItem(key: string): string | null {
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
}

/**
 * setItem
 *
 * Safe wrapper around `localStorage.setItem`; failures are ignored to keep
 * callers resilient to storage restrictions.
 */
export function setItem(key: string, value: string): void {
	try {
		localStorage.setItem(key, value);
	} catch {}
}

/**
 * removeItem
 *
 * Safe wrapper around `localStorage.removeItem` that silently ignores
 * failures.
 */
export function removeItem(key: string): void {
	try {
		localStorage.removeItem(key);
	} catch {}
}
