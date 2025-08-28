import clsx from "clsx";
import { AlertTriangle } from "lucide-react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import type { AmbiguousScheduleWarningProps } from "../../types/components";

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
				"dark:bg-[rgba(255,199,77,0.04)] dark:border-[rgba(255,170,40,0.12)] dark:text-[rgb(217,119,6)]",
			)}
		>
			<div className="flex items-start gap-2">
				<AlertTriangle
					className="mt-0.5 h-5 w-5 flex-shrink-0"
					aria-hidden="true"
				/>
				<div>
					<p className="mb-1 font-medium">Ambiguous Schedule Detected</p>
					<p className="text-sm">{t("nextRuns.ambiguousSchedule")}</p>
				</div>
			</div>
		</div>
	);
};
