import clsx from "clsx";
import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";

/**
 * CronInputWarning
 *
 * Small presentational component used to show validation warnings related to
 * the cron input. It wraps the content in a visually prominent alert box and
 * sets `role="alert"` with `aria-live="polite"` so screen readers will
 * receive the message when it appears.
 *
 * Props
 * @param {ReactNode} children - Warning content (text or list of errors).
 */
export function CronInputWarning({ children }: { children: ReactNode }) {
	return (
		<div
			className={clsx(
				"mb-4 rounded-xl border p-4",
				"border-amber-3 bg-amber-1 text-amber-9",
				"dark:bg-[rgba(255,199,77,0.04)] dark:border-[rgba(255,170,40,0.12)] dark:text-[rgb(217,119,6)]",
			)}
			role="alert"
			aria-live="polite"
		>
			<div className="flex items-start gap-2">
				<AlertTriangle
					className="mt-0.5 h-5 w-5 flex-shrink-0"
					aria-hidden="true"
				/>
				<div>{children}</div>
			</div>
		</div>
	);
}
