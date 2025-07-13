import clsx from "clsx";
import type { ButtonHTMLAttributes, FC } from "react";
import type { ActionButtonProps } from "../types/components";

/**
 * Extended ActionButton props that combines custom ActionButtonProps with native button attributes.
 * This allows the component to accept all standard HTML button properties alongside custom ones.
 */
interface ExtendedActionButtonProps
	extends ActionButtonProps,
		ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * A reusable action button component with consistent styling and animation effects.
 * Provides a primary button appearance with hover, focus, and active states.
 *
 * @param label - The text to display inside the button
 * @param className - Additional CSS classes to apply to the button
 * @param props - All other standard HTML button attributes (onClick, disabled, etc.)
 *
 * @example
 * ```tsx
 * <ActionButton
 *   label="Submit"
 *   onClick={handleSubmit}
 *   disabled={isLoading}
 *   className="w-full"
 * />
 * ```
 */
export const ActionButton: FC<ExtendedActionButtonProps> = ({
	label,
	className = "",
	...props
}) => {
	return (
		<button
			type="button"
			className={clsx(
				"btn btn-primary rounded-xl font-medium transition-all duration-200 disabled:opacity-50 border-2 border-primary/60 shadow-xl hover:shadow-2xl hover:border-accent focus:border-accent focus:shadow-2xl active:scale-95",
				"bg-neutral-900 text-neutral-50 border-neutral-900/60 hover:border-neutral-50 focus:border-neutral-50 dark:bg-gray-100 dark:text-black dark:border-gray-100/60 dark:hover:border-black dark:focus:border-black",
				"px-4 py-2",
				className,
			)}
			{...props}
		>
			{label}
		</button>
	);
};
