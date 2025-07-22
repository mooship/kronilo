import clsx from "clsx";
import type { ButtonHTMLAttributes, FC } from "react";
import type { ActionButtonProps } from "../types/components";

interface ExtendedActionButtonProps
	extends ActionButtonProps,
		ButtonHTMLAttributes<HTMLButtonElement> {}

export const ActionButton: FC<ExtendedActionButtonProps> = ({
	label,
	className = "",
	...props
}) => {
	return (
		<button
			type="button"
			className={clsx(
				"btn btn-primary rounded-xl border-2 border-primary/60 font-medium shadow-xl transition-all duration-200 hover:border-accent hover:shadow-2xl focus:border-accent focus:shadow-2xl active:scale-95 disabled:opacity-50",
				"border-neutral-900/60 bg-neutral-900 text-neutral-50 hover:border-neutral-50 focus:border-neutral-50 dark:border-gray-100/60 dark:bg-gray-100 dark:text-black dark:focus:border-black dark:hover:border-black",
				"px-4 py-2",
				"focus:shadow-lg focus:shadow-primary/30",
				className,
			)}
			{...props}
		>
			{label}
		</button>
	);
};
