import clsx from "clsx";
import type { FC } from "react";
import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCopyToClipboard, useTimeout } from "usehooks-ts";
import { usePressAnimation } from "../hooks/usePressAnimation";
import type { CopyButtonProps } from "../types/components";

const CopyButton: FC<CopyButtonProps> = ({
	value,
	className = "",
	label,
	disabled = false,
}) => {
	const { t } = useTranslation();
	const [copiedText, copy] = useCopyToClipboard();
	const [copied, setCopied] = useState(false);
	const { isPressed, handlePressStart, handlePressEnd } = usePressAnimation();

	const buttonLabel = label || t("actions.copy");
	const isSmall = className.includes("btn-sm");

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
					"focus:shadow-lg focus:shadow-primary/30",
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
