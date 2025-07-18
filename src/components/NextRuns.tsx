import type { FC } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTimeoutFn } from "react-use";
import type { NextRunsProps } from "../types/components";
import { WHITESPACE_REGEX } from "../utils/cronValidation";
import { CopyButton } from "./CopyButton";

/**
 * Component that calculates and displays the next 5 execution times for a cron expression.
 * Features timezone awareness, ambiguous schedule detection, and error handling.
 * Uses debounced calculation to avoid excessive computation on rapid input changes.
 *
 * @param cron - The cron expression to calculate next runs for
 * @param disabled - Whether the component should be disabled (prevents calculation)
 *
 * @example
 * ```tsx
 * <NextRuns cron="0 9 * * 1-5" disabled={false} />
 * // Shows next 5 weekday 9am executions
 * ```
 */
export const NextRuns: FC<NextRunsProps> = ({ cron, disabled }) => {
	const { t, i18n } = useTranslation();
	const lang = (i18n.language || "en").split("-")[0];
	const [runs, setRuns] = useState<string[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [hasAmbiguousSchedule, setHasAmbiguousSchedule] = useState(false);

	type CronParserDefault = typeof import("cron-parser") extends {
		default: infer T;
	}
		? T
		: never;
	const cronParserRef = useRef<CronParserDefault | null>(null);
	const calculateNextRuns = async () => {
		try {
			const cronParts = cron.trim().split(WHITESPACE_REGEX);
			if (cronParts.length >= 5) {
				const dayOfMonth = cronParts[2];
				const dayOfWeek = cronParts[4];
				const isAmbiguous =
					dayOfMonth !== "*" &&
					dayOfWeek !== "*" &&
					!dayOfMonth.includes("/") &&
					!dayOfWeek.includes("/") &&
					!dayOfMonth.includes("-") &&
					!dayOfWeek.includes("-") &&
					!dayOfMonth.includes(",") &&
					!dayOfWeek.includes(",");
				setHasAmbiguousSchedule(isAmbiguous);
			} else {
				setHasAmbiguousSchedule(false);
			}

			if (!cronParserRef.current) {
				const mod = await import("cron-parser");
				cronParserRef.current = mod.default;
			}
			const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
			const parser = cronParserRef.current;
			if (!parser) {
				throw new Error("cron-parser not loaded");
			}
			const interval = parser.parse(cron, { tz });
			const nextDates: string[] = [];
			for (let i = 0; i < 5; i++) {
				const date = interval.next().toDate();
				nextDates.push(
					date.toLocaleString(lang, {
						weekday: "long",
						year: "numeric",
						month: "long",
						day: "numeric",
						hour: "2-digit",
						minute: "2-digit",
						second: "2-digit",
						timeZoneName: "long",
					}),
				);
			}
			setRuns(nextDates);
			setError(null);
		} catch (e) {
			setRuns([]);
			setError(e instanceof Error ? e.message : "Invalid cron expression");
			setHasAmbiguousSchedule(false);
		}
		setLoading(false);
	};

	const [, cancel, reset] = useTimeoutFn(() => {
		calculateNextRuns();
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

			{hasAmbiguousSchedule && (
				<div className="mb-4 rounded-xl border border-yellow-300 bg-yellow-100 p-4 text-yellow-800 dark:border-yellow-400 dark:bg-yellow-300/20 dark:text-yellow-200">
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
			)}

			<div className="min-h-[16rem]">
				{error ? (
					<div className="rounded-xl border border-yellow-300 bg-yellow-100 p-4 text-yellow-700 dark:border-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
						<span>{error}</span>
					</div>
				) : loading ? (
					<div className="flex items-center gap-2 rounded-xl bg-gray-50 p-6 text-black dark:bg-neutral-700 dark:text-neutral-50">
						<span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent dark:border-neutral-50 dark:border-t-transparent"></span>
						{t("nextRuns.loading")}
					</div>
				) : runs.length === 0 ? (
					<div className="rounded-xl bg-gray-50 p-6 text-center text-gray-500 dark:bg-neutral-700 dark:text-gray-400">
						{t("nextRuns.noRuns")}
					</div>
				) : (
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
				)}
			</div>
		</div>
	);
};
