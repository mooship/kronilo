import { useState } from "react";

interface CopyButtonProps {
	value: string;
	className?: string;
	label?: string;
	disabled?: boolean;
}

export function CopyButton({
	value,
	className = "",
	label = "Copy",
	disabled = false,
}: CopyButtonProps) {
	const [copied, setCopied] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const isSmall = className.includes("btn-sm");

	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(true);
			setError(null);
			setTimeout(() => setCopied(false), 1200);
		} catch {
			setError("Failed to copy");
		}
	}

	return (
		<div className={`relative inline-block ${className}`}>
			<button
				type="button"
				className={`btn btn-primary rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 ${
					isSmall ? "btn-sm px-4 py-2" : "btn-lg px-6 py-3"
				}`}
				aria-label={label}
				onClick={handleCopy}
				disabled={disabled || !value}
			>
				{copied ? (
					<span aria-live="polite" className="flex items-center gap-2">
						<span>✓</span> Copied!
					</span>
				) : (
					<span className="flex items-center gap-2">{label}</span>
				)}
			</button>
			{error && (
				<div className="absolute left-0 mt-1">
					<div className="alert alert-error alert-sm rounded-lg">
						<span className="text-xs">{error}</span>
					</div>
				</div>
			)}
		</div>
	);
}
