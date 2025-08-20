import clsx from "clsx";
import type { ButtonHTMLAttributes, FC } from "react";
import { memo } from "react";
import type { ActionButtonProps } from "../../types/components";

interface ExtendedActionButtonProps
	extends ActionButtonProps,
		ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * ActionButton
 *
 * Reusable primary button used across the app. Accepts standard button
 * attributes (type, disabled, onClick, etc.) as well as a `label` prop for
 * display. The button includes focus styles and an accessible role via the
 * native `<button>` element.
 *
 * Props
 * - label: visible button text
 * - className: optional additional class names
 * - ...props: forwarded native button attributes
 */
const ActionButton: FC<ExtendedActionButtonProps> = ({
	label,
	className = "",
	...props
}) => {
	return (
		<button
			type="button"
			className={clsx(
				"btn rounded-xl border-2 font-medium shadow-xl transition-all duration-200 active:scale-95 disabled:opacity-50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-8 focus:ring-offset-2 focus:ring-offset-background",
				"border-blue-9 bg-blue-9 text-white hover:bg-blue-10 hover:border-blue-10 focus:bg-blue-10 focus:border-blue-10",
				className,
			)}
			{...props}
		>
			{label}
		</button>
	);
};

export const MemoizedActionButton = memo(ActionButton);
