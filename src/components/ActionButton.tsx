import clsx from "clsx";
import type { ButtonHTMLAttributes, FC } from "react";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	label: string;
	className?: string;
}

export const ActionButton: FC<ActionButtonProps> = ({
	label,
	className = "",
	...props
}) => {
	return (
		<button
			type="button"
			className={clsx(
				"btn btn-primary rounded-lg font-medium transition-all duration-200 disabled:opacity-50 border-2 border-primary/60 shadow-xl hover:shadow-2xl hover:border-accent focus:border-accent focus:shadow-2xl active:scale-95 btn-sm px-4 py-2",
				className,
			)}
			{...props}
		>
			{label}
		</button>
	);
};
