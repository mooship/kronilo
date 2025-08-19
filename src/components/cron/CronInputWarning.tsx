import clsx from "clsx";
import type { FC, ReactNode } from "react";

interface CronInputWarningProps {
	children: ReactNode;
}

export const CronInputWarning: FC<CronInputWarningProps> = ({ children }) => (
	<div
		className={clsx(
			"mb-4 rounded-xl border p-4",
			"border-yellow-300 bg-yellow-100 text-yellow-800",
			"dark:border-yellow-400 dark:bg-yellow-300/20 dark:text-yellow-200",
		)}
		role="alert"
		aria-live="polite"
	>
		<div className="flex items-start gap-2">
			<svg
				className="mt-0.5 h-5 w-5 flex-shrink-0"
				fill="currentColor"
				viewBox="0 0 20 20"
				aria-hidden="true"
			>
				<path
					fillRule="evenodd"
					d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.178 2.625-1.515 2.625H3.72c-1.337 0-2.188-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
					clipRule="evenodd"
				/>
			</svg>
			<div>{children}</div>
		</div>
	</div>
);
