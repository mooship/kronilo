import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTimeoutFn } from "react-use";
import type { NextRunsProps } from "../types/components";
import { calculateNextRuns } from "../utils/cronScheduleCalculator";
import { AmbiguousScheduleWarning } from "./AmbiguousScheduleWarning";
import { CopyButton } from "./CopyButton";
import { NextRunsList } from "./NextRunsList";

export const NextRuns: FC<NextRunsProps> = ({ cron, disabled }) => {
	const { t, i18n } = useTranslation();
	const lang = (i18n.language || "en").split("-")[0];
	const [runs, setRuns] = useState<string[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [hasAmbiguousSchedule, setHasAmbiguousSchedule] = useState(false);

	const performCalculation = async () => {
		setLoading(true);
		const result = await calculateNextRuns(cron, lang);
		setRuns(result.runs);
		setError(result.error);
		setHasAmbiguousSchedule(result.hasAmbiguousSchedule);
		setLoading(false);
	};

	const [, cancel, reset] = useTimeoutFn(() => {
		performCalculation();
	}, 500);

	useEffect(() => {
		if (!cron.trim() || disabled) {
			setRuns([]);
			setError(null);
			setLoading(false);
			setHasAmbiguousSchedule(false);
			cancel();
			return;
		}

		setLoading(true);
		reset();
	}, [cron, disabled, cancel, reset]);

	const runsCopyValue = useMemo(() => runs.join("\n\n"), [runs]);

	if (!cron.trim() || disabled) {
		return (
			<div className="mb-6 min-h-[20rem]" aria-live="polite">
				<div className="mb-4 flex items-center justify-between">
					<h3 className="font-semibold text-black text-lg sm:text-xl md:text-2xl dark:text-neutral-50">
						{t("nextRuns.title")}
					</h3>
					<CopyButton
						value=""
						label={t("actions.copy")}
						className="btn-sm"
						disabled
					/>
				</div>
				<div className="rounded-xl bg-gray-50 p-6 text-center text-gray-500 dark:bg-neutral-700 dark:text-gray-400 min-h-[16rem] flex items-center justify-center">
					{t("nextRuns.placeholder")}
				</div>
			</div>
		);
	}

	return (
		<div className="mb-6 min-h-[20rem]" aria-live="polite">
			<div className="mb-4 flex items-center justify-between">
				<h3 className="font-semibold text-black text-xl dark:text-neutral-50">
					{t("nextRuns.title")}
				</h3>
				<CopyButton
					value={runsCopyValue}
					label={t("actions.copy")}
					className="btn-sm"
				/>
			</div>

			<AmbiguousScheduleWarning show={hasAmbiguousSchedule} />

			<div className="min-h-[16rem]">
				<NextRunsList runs={runs} error={error} loading={loading} />
			</div>
		</div>
	);
};
