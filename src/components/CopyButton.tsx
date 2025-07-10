import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
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
	const [isPressed, setIsPressed] = useState(false);

	const isSmall = className.includes("btn-sm");

	const errorId = useMemo(() => {
		return `copy-error-${Math.random().toString(36).slice(2, 10)}`;
	}, []);

	const resetCopiedState = () => setCopied(false);
	const [, , resetCopiedTimeout] = useTimeoutFn(resetCopiedState, 1200);

	useEffect(() => {
		if (copyState.value === value && !copyState.error) {
			setCopied(true);
			resetCopiedTimeout();
		}
	}, [copyState, value, resetCopiedTimeout]);

	function handleCopy() {
		setIsPressed(true);
		copyToClipboard(value);
		setTimeout(() => setIsPressed(false), 120);
	}

	return (
		<div className={clsx("relative inline-block", className)}>
			<button
				type="button"
				className={clsx(
					"btn btn-primary rounded-xl font-medium transition-all duration-200 disabled:opacity-50 border-2 border-primary/60 shadow-xl hover:shadow-2xl hover:border-accent focus:border-accent focus:shadow-2xl active:scale-95",
					isSmall ? "btn-sm px-4 py-2" : "btn-lg px-6 py-3",
					isPressed && "scale-95",
				)}
				aria-label={label}
				onClick={handleCopy}
				disabled={disabled || !value}
				aria-describedby={copyState.error ? errorId : undefined}
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
					<div
						className="alert alert-error alert-sm rounded-lg"
						id={errorId}
						role="alert"
					>
						<span className="text-xs">{copyState.error.message}</span>
					</div>
				</div>
			)}
		</div>
	);
}
