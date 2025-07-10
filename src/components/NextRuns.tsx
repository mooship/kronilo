import cronParser from "cron-parser";
import { useEffect, useState } from "react";
import { useTimeoutFn } from "react-use";
import { CopyButton } from "./CopyButton";

const WHITESPACE_REGEX = /\s+/;

interface NextRunsProps {
	cron: string;
	disabled?: boolean;
}

export function NextRuns({ cron, disabled }: NextRunsProps) {
	const [runs, setRuns] = useState<string[]>([]);
	const [error, setError] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState(false);
	const [hasAmbiguousSchedule, setHasAmbiguousSchedule] = useState(false);

	const calculateNextRuns = () => {
		try {
			// Check for ambiguous schedule
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

			const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
			const interval = cronParser.parse(cron, { tz });
			const nextDates: string[] = [];
			for (let i = 0; i < 5; i++) {
				nextDates.push(interval.next().toLocaleString());
			}
			setRuns(nextDates);
			setError(undefined);
		} catch (e) {
			setRuns([]);
			setError(e instanceof Error ? e.message : "Invalid cron expression");
			setHasAmbiguousSchedule(false);
		}
		setLoading(false);
	};

	const [, cancel, reset] = useTimeoutFn(calculateNextRuns, 500);

	useEffect(() => {
		if (!cron.trim() || disabled) {
			setRuns([]);
			setError(undefined);
			setLoading(false);
			setHasAmbiguousSchedule(false);
			cancel();
			return;
		}

		setLoading(true);
		reset();
	}, [cron, disabled, cancel, reset]);

	if (!cron.trim() || disabled) {
		return null;
	}

	return (
		<div className="mb-6">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-xl font-semibold text-base-content">
					Next 5 runs:
				</h3>
				<CopyButton value={runs.join("\n")} label="Copy" className="btn-sm" />
			</div>

			{hasAmbiguousSchedule && (
				<div className="bg-orange-400/10 border border-orange-400/30 text-orange-400 rounded-xl p-4 mb-4">
					<div className="flex items-start gap-2">
						<svg
							className="w-5 h-5 mt-0.5 flex-shrink-0"
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
							<p className="font-medium mb-1">Ambiguous Schedule Detected</p>
							<p className="text-sm">
								This cron expression specifies both a specific day of the month
								AND a specific day of the week. It will run on EITHER condition
								(OR logic), not both together.
							</p>
						</div>
					</div>
				</div>
			)}

			{error ? (
				<div className="bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 rounded-xl p-4">
					<span>{error}</span>
				</div>
			) : loading ? (
				<div className="flex items-center gap-2 bg-base-300/30 rounded-xl p-6 text-base-content">
					<span className="animate-spin inline-block w-5 h-5 border-2 border-primary border-t-transparent rounded-full"></span>
					Calculating next runs...
				</div>
			) : (
				<div className="bg-base-300/30 rounded-xl p-6">
					<ul className="space-y-3">
						{runs.map((run, index) => (
							<li key={run} className="flex items-center gap-3">
								<span className="badge badge-primary badge-lg font-medium">
									{index + 1}
								</span>
								<span className="font-mono text-base text-base-content bg-base-100/50 px-3 py-2 rounded-lg">
									{run}
								</span>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
