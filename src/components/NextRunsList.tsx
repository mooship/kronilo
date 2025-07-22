import type { FC } from "react";
import { useTranslation } from "react-i18next";
import type { NextRunsListProps } from "../types";

export const NextRunsList: FC<NextRunsListProps> = ({
	runs,
	error,
	loading,
}) => {
	const { t } = useTranslation();

	if (error) {
		return (
			<div className="rounded-xl border border-yellow-300 bg-yellow-100 p-4 text-yellow-700 dark:border-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
				<span>{error}</span>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="flex items-center gap-2 rounded-xl bg-gray-50 p-6 text-black dark:bg-neutral-700 dark:text-neutral-50">
				<span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent dark:border-neutral-50 dark:border-t-transparent"></span>
				{t("nextRuns.loading")}
			</div>
		);
	}

	if (runs.length === 0) {
		return (
			<div className="rounded-xl bg-gray-50 p-6 text-center text-gray-500 dark:bg-neutral-700 dark:text-gray-400">
				{t("nextRuns.noRuns")}
			</div>
		);
	}

	return (
		<div className="rounded-xl bg-gray-50 p-6 dark:bg-neutral-700">
			<ul className="space-y-3">
				{runs.map((run, index) => (
					<li key={run} className="flex items-center gap-3">
						<span className="font-bold text-black text-lg dark:text-neutral-50">
							{index + 1}.
						</span>
						<span className="font-mono text-base text-black dark:text-neutral-50">
							{run}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
};
