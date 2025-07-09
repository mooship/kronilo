import { useState } from "react";

export function useClipboard(timeout = 1200) {
	const [copied, setCopied] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function copy(value: string) {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(true);
			setError(null);
			setTimeout(() => setCopied(false), timeout);
		} catch {
			setError("Failed to copy");
		}
	}

	return { copied, error, copy };
}
