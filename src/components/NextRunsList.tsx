import clsx from "clsx";
import type { FC } from "react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import type { NextRunsListProps } from "../types";

const NextRunsList: FC<NextRunsListProps> = ({ runs, error, loading }) => {
	const { t } = useTranslation();

	if (error) {
		return (
			<div
				className={clsx(
					"rounded-xl border p-4",
					"bg-yellow-100 text-yellow-700 border-yellow-300",
					"dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700",
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
					"bg-gray-50 text-black",
					"dark:bg-neutral-700 dark:text-neutral-50",
				)}
			>
				<span
					className={clsx(
						"inline-block h-5 w-5 animate-spin rounded-full border-2",
						"border-black border-t-transparent",
						"dark:border-neutral-50 dark:border-t-transparent",
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
					"bg-gray-50 text-gray-500",
					"dark:bg-neutral-700 dark:text-gray-400",
				)}
			>
				{t("nextRuns.noRuns")}
			</div>
		);
	}

	return (
		<div
			className={clsx("rounded-xl p-6", "bg-gray-50", "dark:bg-neutral-700")}
		>
			<ul className="space-y-3">
				{runs.map((run, index) => (
					<li key={run} className="flex items-center gap-3">
						<span
							className={clsx(
								"font-bold text-lg",
								"text-black",
								"dark:text-neutral-50",
							)}
						>
							{index + 1}.
						</span>
						<span
							className={clsx(
								"font-mono text-base",
								"text-black",
								"dark:text-neutral-50",
							)}
						>
							{run}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
};

export const MemoizedNextRunsList = memo(NextRunsList);
