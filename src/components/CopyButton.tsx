import { useEffect, useState } from "react";
import { useCopyToClipboard, useTimeoutFn } from "react-use";

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
	const [copyState, copyToClipboard] = useCopyToClipboard();
	const [copied, setCopied] = useState(false);

	const isSmall = className.includes("btn-sm");

	const resetCopiedState = () => setCopied(false);
	const [, , resetCopiedTimeout] = useTimeoutFn(resetCopiedState, 1200);

	useEffect(() => {
		if (copyState.value === value && !copyState.error) {
			setCopied(true);
			resetCopiedTimeout();
		}
	}, [copyState, value, resetCopiedTimeout]);

	function handleCopy() {
		copyToClipboard(value);
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
			{copyState.error && (
				<div className="absolute left-0 mt-1">
					<div className="alert alert-error alert-sm rounded-lg">
						<span className="text-xs">{copyState.error.message}</span>
					</div>
				</div>
			)}
		</div>
	);
}
