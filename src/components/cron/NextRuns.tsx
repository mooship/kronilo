import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { cronCalculationResultSchema } from "../../schemas/cron";
import type { NextRunsProps } from "../../types/components";
import type { CronCalculationResult } from "../../types/utils";
import { calculateNextRuns } from "../../utils/cronScheduleCalculator";
import { MemoizedCopyButton } from "../ui/CopyButton";
import { AmbiguousScheduleWarning } from "./AmbiguousScheduleWarning";
import { MemoizedNextRunsList } from "./NextRunsList";

/**
 * NextRuns
 *
 * Calculates and displays the upcoming run times for a supplied cron
 * expression. Uses React Query to asynchronously compute runs via
 * `calculateNextRuns` and validates the result shape. Shows a placeholder
 * when disabled or when there is no cron expression, and a copy button to
 * copy the runs as plain text.
 *
 * Props
 * @param {string} cron - Cron expression to evaluate.
 * @param {boolean} disabled - If true, calculation and UI are disabled and a
 * placeholder is shown instead.
 */
const NextRuns: FC<NextRunsProps> = ({ cron, disabled }) => {
	const { t, i18n } = useTranslation();
	const lang = (i18n.language || "en").split("-")[0];

	const isEnabled = !!cron.trim() && !disabled;
	const { data, error, isLoading } = useQuery<CronCalculationResult, Error>({
		queryKey: ["nextRuns", cron, lang],
		queryFn: async () => {
			const result = await calculateNextRuns(cron, lang);
			const validation = cronCalculationResultSchema.safeParse(result);
			if (!validation.success) {
				throw new Error("Invalid data shape from calculateNextRuns");
			}
			return validation.data;
		},
		enabled: isEnabled,
		staleTime: 0,
		refetchOnWindowFocus: false,
		retry: 1,
	});

	const runs = isEnabled && data ? data.runs : [];
	const hasAmbiguousSchedule =
		isEnabled && data ? data.hasAmbiguousSchedule : false;

	const runsCopyValue = useMemo(() => runs.join("\n\n"), [runs]);

	if (!isEnabled) {
		return (
			<div className="mb-6 min-h-[20rem]" aria-live="polite">
				<div className="mb-4 flex items-center justify-between">
					<h3 className="font-semibold text-foreground text-lg sm:text-xl md:text-2xl">
						{t("nextRuns.title")}
					</h3>
					<MemoizedCopyButton
						value=""
						label={t("actions.copy")}
						className="btn-sm"
						disabled
					/>
				</div>
				<div className="rounded-xl bg-background-secondary p-6 text-center text-foreground-secondary min-h-[16rem] flex items-center justify-center">
					{t("nextRuns.placeholder")}
				</div>
			</div>
		);
	}

	return (
		<div className="mb-6 min-h-[20rem]" aria-live="polite">
			<div className="mb-4 flex items-center justify-between">
				<h3 className="font-semibold text-foreground text-xl">
					{t("nextRuns.title")}
				</h3>
				<MemoizedCopyButton
					value={runsCopyValue}
					label={t("actions.copy")}
					className="btn-sm"
				/>
			</div>

			<AmbiguousScheduleWarning show={hasAmbiguousSchedule} />

			<div className="min-h-[16rem]">
				<MemoizedNextRunsList
					runs={runs}
					error={error ? error.message : data?.error || null}
					loading={isLoading}
				/>
			</div>
		</div>
	);
};

export const MemoizedNextRuns = memo(NextRuns);
