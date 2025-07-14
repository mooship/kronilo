import clsx from "clsx";
import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCopyToClipboard, useTimeoutFn } from "react-use";
import { usePressAnimation } from "../hooks/usePressAnimation";
import type { CopyButtonProps } from "../types/components";

/**
 * A copy-to-clipboard button component with visual feedback and error handling.
 * Shows success state after copying and displays error messages if copying fails.
 * Includes press animation effects and accessibility features.
 *
 * @param value - The text value to copy to clipboard
 * @param className - Additional CSS classes to apply
 * @param label - Accessibility label for the button (default: "Copy")
 * @param disabled - Whether the button should be disabled
 *
 * @example
 * ```tsx
 * <CopyButton
 *   value="0 9 * * *"
 *   label="Copy cron expression"
 *   className="btn-sm"
 * />
 * ```
 */
export const CopyButton: FC<CopyButtonProps> = ({
	value,
	className = "",
	label,
	disabled = false,
}) => {
	const { t } = useTranslation();
	const [copyState, copyToClipboard] = useCopyToClipboard();
	const [copied, setCopied] = useState(false);
	const { isPressed, handlePressStart, handlePressEnd } = usePressAnimation();

	const buttonLabel = label || t("actions.copy");
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
		handlePressStart();
		copyToClipboard(value);
		setTimeout(() => handlePressEnd(), 120);
	}

	return (
		<div className={clsx("relative inline-block", className)}>
			<button
				type="button"
				className={clsx(
					"btn btn-primary rounded-xl border-2 border-primary/60 font-medium shadow-xl transition-all duration-200 hover:border-accent hover:shadow-2xl focus:border-accent focus:shadow-2xl active:scale-95 disabled:opacity-50",
					"border-neutral-900/60 bg-neutral-900 text-neutral-50 hover:border-neutral-50 focus:border-neutral-50 dark:border-gray-100/60 dark:bg-gray-100 dark:text-black dark:focus:border-black dark:hover:border-black",
					isSmall ? "btn-sm px-4 py-2" : "btn-lg px-6 py-3",
					isPressed && "scale-95",
				)}
				aria-label={buttonLabel}
				onClick={handleCopy}
				disabled={disabled || !value}
				aria-describedby={copyState.error ? errorId : undefined}
				onMouseDown={handlePressStart}
				onMouseUp={handlePressEnd}
				onMouseLeave={handlePressEnd}
				onTouchStart={handlePressStart}
				onTouchEnd={handlePressEnd}
			>
				{copied ? (
					<span aria-live="polite" className="flex items-center gap-2">
						<span>✓</span> {t("actions.copied")}
					</span>
				) : (
					<span className="flex items-center gap-2">{buttonLabel}</span>
				)}
			</button>
			{copyState.error && (
				<div className="absolute left-0 mt-1">
					<div
						className="alert alert-error alert-sm rounded-xl border-red-300 bg-red-100 text-red-700 dark:border-red-700 dark:bg-red-900 dark:text-red-300"
						id={errorId}
						role="alert"
					>
						<span className="text-xs">{copyState.error.message}</span>
					</div>
				</div>
			)}
		</div>
	);
};
