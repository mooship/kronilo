import type { FC } from "react";
import { memo, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useKroniloStore } from "../../hooks/useKroniloStore";
import { cronCalculationResultSchema } from "../../schemas/cron";
import type { NextRunsProps } from "../../types/components";
import { calculateNextRuns } from "../../utils/cronScheduleCalculator";
import { MemoizedCopyButton } from "../ui/CopyButton";
import { AmbiguousScheduleWarning } from "./AmbiguousScheduleWarning";
import { MemoizedNextRunsList } from "./NextRunsList";

const NextRuns: FC<NextRunsProps> = ({ cron, disabled }) => {
	const { t, i18n } = useTranslation();
	const lang = (i18n.language || "en").split("-")[0];
	const isEnabled = !!cron.trim() && !disabled;
	const runs = useKroniloStore((s) => s.runs);
	const setRuns = useKroniloStore((s) => s.setRuns);
	const error = useKroniloStore((s) => s.error);
	const setError = useKroniloStore((s) => s.setError);
	const loading = useKroniloStore((s) => s.loading);
	const setLoading = useKroniloStore((s) => s.setLoading);
	const hasAmbiguousSchedule = useKroniloStore((s) => s.hasAmbiguousSchedule);
	const setHasAmbiguousSchedule = useKroniloStore(
		(s) => s.setHasAmbiguousSchedule,
	);

	useEffect(() => {
		let ignore = false;
		if (!isEnabled) {
			setRuns([]);
			setError(null);
			setLoading(false);
			setHasAmbiguousSchedule(false);
			return;
		}
		setLoading(true);
		setError(null);
		calculateNextRuns(cron, lang)
			.then((result) => {
				const validation = cronCalculationResultSchema.safeParse(result);
				if (!validation.success) {
					throw new Error("Invalid data shape from calculateNextRuns");
				}
				if (!ignore) {
					setRuns(validation.data.runs);
					setHasAmbiguousSchedule(validation.data.hasAmbiguousSchedule);
				}
			})
			.catch((err) => {
				if (!ignore) {
					setError(err.message || "Unknown error");
					setRuns([]);
					setHasAmbiguousSchedule(false);
				}
			})
			.finally(() => {
				if (!ignore) setLoading(false);
			});
		return () => {
			ignore = true;
		};
	}, [
		cron,
		lang,
		isEnabled,
		setRuns,
		setError,
		setLoading,
		setHasAmbiguousSchedule,
	]);

	const runsCopyValue = useMemo(() => runs.join("\n\n"), [runs]);

	if (!isEnabled) {
		return (
			<div className="mb-6 min-h-[20rem]" aria-live="polite">
				<div className="mb-4 flex items-center justify-between">
					<h3 className="font-semibold text-foreground text-lg sm:text-xl md:text-2xl">
						{t("nextRuns.title", "Next 5 Runs:")}
					</h3>
					<MemoizedCopyButton
						value=""
						label={t("actions.copy", "Copy")}
						className="btn-sm"
						disabled
					/>
				</div>
				<div className="rounded-xl bg-background-secondary p-6 text-center text-foreground-secondary min-h-[16rem] flex items-center justify-center">
					{t(
						"nextRuns.placeholder",
						"Enter a valid cron expression to see upcoming execution times",
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="mb-6 min-h-[20rem]" aria-live="polite">
			<div className="mb-4 flex items-center justify-between">
				<h3 className="font-semibold text-foreground text-xl">
					{t("nextRuns.title", "Next 5 Runs:")}
				</h3>
				<MemoizedCopyButton
					value={runsCopyValue}
					label={t("actions.copy", "Copy")}
					className="btn-sm"
				/>
			</div>

			<AmbiguousScheduleWarning show={hasAmbiguousSchedule} />

			<div className="min-h-[16rem]">
				<MemoizedNextRunsList runs={runs} error={error} loading={loading} />
			</div>
		</div>
	);
};

export const MemoizedNextRuns = memo(NextRuns);
