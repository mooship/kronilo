import cronParser from "cron-parser";
import { useEffect, useState } from "react";
import { CopyButton } from "./CopyButton";

interface NextRunsProps {
	cron: string;
	disabled?: boolean;
}

export function NextRuns({ cron, disabled }: NextRunsProps) {
	const [runs, setRuns] = useState<string[]>([]);
	const [error, setError] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!cron.trim() || disabled) {
			setRuns([]);
			setError(undefined);
			setLoading(false);
			return;
		}

		setLoading(true);
		const timer = setTimeout(() => {
			try {
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
			}
			setLoading(false);
		}, 500);

		return () => {
			clearTimeout(timer);
			setLoading(false);
		};
	}, [cron, disabled]);

	if (!cron.trim() || disabled) return null;

	return (
		<div className="mb-6">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-xl font-semibold text-base-content">
					Next 5 runs:
				</h3>
				<CopyButton value={runs.join("\n")} label="Copy" className="btn-sm" />
			</div>
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
