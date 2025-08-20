import clsx from "clsx";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import type { AmbiguousScheduleWarningProps } from "../../types/components";

/**
 * AmbiguousScheduleWarning
 *
 * Visual warning that indicates a cron expression produces an ambiguous schedule
 * (for example when daylight saving time transitions or conflicting fields make
 * the schedule unclear). The component is purely presentational and is only
 * rendered when the `show` prop is true.
 *
 * Props
 * @param {boolean} show - Whether to show the warning box. When false the
 * component returns null.
 *
 * Accessible notes: the icon and text are grouped and styled to be readable by
 * screen readers; the component does not manage focus.
 */
export const AmbiguousScheduleWarning: FC<AmbiguousScheduleWarningProps> = ({
	show,
}) => {
	const { t } = useTranslation();

	if (!show) {
		return null;
	}

	return (
		<div
			className={clsx(
				"mb-4 rounded-xl border p-4",
				"border-amber-3 bg-amber-1 text-amber-9",
			)}
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
				<div>
					<p className="mb-1 font-medium">Ambiguous Schedule Detected</p>
					<p className="text-sm">{t("nextRuns.ambiguousSchedule")}</p>
				</div>
			</div>
		</div>
	);
};
