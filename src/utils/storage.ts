/**
 * Get a value from localStorage by key, or null if unavailable.
 *
 * @param key The storage key
 * @returns {string | null} The stored value or null
 */
export function getItem(key: string): string | null {
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
}

/**
 * Set a value in localStorage by key.
 *
 * @param key The storage key
 * @param value The value to store
 */
export function setItem(key: string, value: string): void {
	try {
		localStorage.setItem(key, value);
	} catch {}
}

/**
 * Remove a value from localStorage by key.
 *
 * @param key The storage key
 */
export function removeItem(key: string): void {
	try {
		localStorage.removeItem(key);
	} catch {}
}
