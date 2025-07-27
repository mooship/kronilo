import clsx from "clsx";
import type { FC } from "react";
import { memo, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCopyToClipboard, useTimeout } from "usehooks-ts";
import { usePressAnimation } from "../hooks/usePressAnimation";
import type { CopyButtonProps } from "../types/components";

const CopyButton: FC<CopyButtonProps> = ({
	value,
	className = "",
	label,
	disabled = false,
	size = "lg",
}) => {
	const { t } = useTranslation();
	const [copiedText, copy] = useCopyToClipboard();
	const [copied, setCopied] = useState(false);
	const { isPressed, handlePressStart, handlePressEnd } = usePressAnimation();
	const pressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const buttonLabel = label || t("actions.copy");
	const isSmall = size === "sm";

	useTimeout(
		() => {
			if (copied) setCopied(false);
		},
		copied ? 1200 : null,
	);

	useEffect(() => {
		if (copiedText) {
			setCopied(true);
		}
	}, [copiedText]);

	function handleCopy() {
		handlePressStart();
		copy(value);
		if (pressTimeoutRef.current) {
			clearTimeout(pressTimeoutRef.current);
		}
		pressTimeoutRef.current = setTimeout(() => {
			handlePressEnd();
			pressTimeoutRef.current = null;
		}, 120);
	}

	useEffect(() => {
		return () => {
			if (pressTimeoutRef.current) {
				clearTimeout(pressTimeoutRef.current);
			}
		};
	}, []);

	return (
		<div className={clsx("relative inline-block", className)}>
			<button
				type="button"
				className={clsx(
					"btn rounded-xl border-2 font-medium shadow-xl transition-all duration-200 active:scale-95 disabled:opacity-50",
					"border-violet-600 bg-transparent text-violet-700 hover:border-violet-500 hover:bg-violet-100 focus:border-violet-500 focus:bg-violet-100",
					"dark:border-violet-400 dark:bg-transparent dark:text-violet-300 dark:hover:bg-violet-900 dark:focus:bg-violet-900",
					isSmall ? "btn-sm px-4 py-2" : "btn-lg px-6 py-3",
					"focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-violet-500 dark:focus:ring-offset-neutral-900",
					"transition-colors duration-200",
					"focus:shadow-lg focus:shadow-violet-400/30",
					isPressed && "scale-95",
				)}
				aria-label={buttonLabel}
				onClick={handleCopy}
				disabled={disabled || !value}
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
		</div>
	);
};

export const MemoizedCopyButton = memo(CopyButton);
