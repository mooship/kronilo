import clsx from "clsx";
import type { FC } from "react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import type { NextRunsListProps } from "../../types";

/**
 * NextRunsList
 *
 * Presentational list component responsible for rendering the computed next
 * run timestamps. Handles three states:
 * - error: renders an alert box with the error message
 * - loading: renders a spinner with a loading label
 * - empty: renders a placeholder when no runs are available
 *
 * Props
 * @param {string[]} runs - Array of human-readable run timestamps.
 * @param {string | null} error - Optional error message to display.
 * @param {boolean} loading - Whether the runs are currently being loaded.
 */
const NextRunsList: FC<NextRunsListProps> = ({ runs, error, loading }) => {
	const { t } = useTranslation();

	if (error) {
		return (
			<div
				className={clsx(
					"rounded-xl border p-4",
					"bg-amber-1 text-amber-9 border-amber-3",
				)}
			>
				<span>{error}</span>
			</div>
		);
	}

	if (loading) {
		return (
			<div
				className={clsx(
					"flex items-center gap-2 rounded-xl p-6",
					"bg-background-secondary text-foreground",
				)}
			>
				<span
					className={clsx(
						"inline-block h-5 w-5 animate-spin rounded-full border-2",
						"border-foreground border-t-transparent",
					)}
				></span>
				{t("nextRuns.loading")}
			</div>
		);
	}

	if (runs.length === 0) {
		return (
			<div
				className={clsx(
					"rounded-xl p-6 text-center",
					"bg-background-secondary text-foreground-secondary",
				)}
			>
				{t("nextRuns.noRuns")}
			</div>
		);
	}

	return (
		<div className={clsx("rounded-xl p-6", "bg-background-secondary")}>
			<ul className="space-y-3">
				{runs.map((run, index) => (
					<li key={run} className="flex items-center gap-3">
						<span className={clsx("font-bold text-lg", "text-foreground")}>
							{index + 1}.
						</span>
						<span className={clsx("font-mono text-base", "text-foreground")}>
							{run}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
};

export const MemoizedNextRunsList = memo(NextRunsList);
