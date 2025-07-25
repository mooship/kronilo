import clsx from "clsx";
import type { ButtonHTMLAttributes, FC } from "react";
import { memo } from "react";
import type { ActionButtonProps } from "../types/components";

interface ExtendedActionButtonProps
	extends ActionButtonProps,
		ButtonHTMLAttributes<HTMLButtonElement> {}

const ActionButton: FC<ExtendedActionButtonProps> = ({
	label,
	className = "",
	...props
}) => {
	return (
		<button
			type="button"
			className={clsx(
				"btn rounded-xl border-2 font-medium shadow-xl transition-all duration-200 active:scale-95 disabled:opacity-50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-emerald-500 dark:focus:ring-offset-neutral-900 transition-colors duration-200",
				"border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700 hover:border-emerald-700 focus:bg-emerald-700 focus:border-emerald-700 dark:bg-emerald-400 dark:text-neutral-900 dark:hover:bg-emerald-500 dark:focus:bg-emerald-500",
				className,
			)}
			{...props}
		>
			{label}
		</button>
	);
};

export const MemoizedActionButton = memo(ActionButton);
