/**
 * Safely retrieves an item from localStorage with error handling.
 * Returns null if the item doesn't exist or if localStorage is unavailable.
 *
 * @param key - The localStorage key to retrieve
 * @returns The stored value or null if not found or on error
 */
export function getItem(key: string): string | null {
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
}

/**
 * Safely stores an item in localStorage with error handling.
 * Silently fails if localStorage is unavailable (e.g., in private browsing mode).
 *
 * @param key - The localStorage key to set
 * @param value - The value to store
 */
export function setItem(key: string, value: string): void {
	try {
		localStorage.setItem(key, value);
	} catch {}
}

/**
 * Safely removes an item from localStorage with error handling.
 * Silently fails if localStorage is unavailable.
 *
 * @param key - The localStorage key to remove
 */
export function removeItem(key: string): void {
	try {
		localStorage.removeItem(key);
	} catch {}
}
