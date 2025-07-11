import { useState } from "react";
import { translateToCron } from "../api/translateToCron";
import { ActionButton } from "./ActionButton";
import { CopyButton } from "./CopyButton";
import { NextRuns } from "./NextRuns";

export function EnglishToCron() {
	const [english, setEnglish] = useState("");
	const [cron, setCron] = useState("");
	const [isPressed, setIsPressed] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleGenerate() {
		setError(null);
		setCron("");
		setLoading(true);
		try {
			const result = await translateToCron(english);
			setCron(result.cron);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex flex-col gap-8">
			<div className="mb-8 flex flex-col w-full">
				<label
					htmlFor="english-input"
					className="block text-xl font-semibold text-base-content mb-6 text-center w-full"
				>
					English Schedule
				</label>
				<div className="relative flex items-center justify-center gap-3 w-full">
					<input
						id="english-input"
						type="text"
						className="input input-bordered bg-gray-50 text-gray-900 placeholder-gray-500 font-mono text-lg px-4 py-3 flex-1 min-w-0 h-12 rounded-lg border-2 transition-colors duration-200 focus:outline-none border-gray-200 hover:border-blue-600/50 focus:border-blue-600"
						placeholder="e.g. run once a week on a thursday"
						value={english}
						onChange={(e) => setEnglish(e.target.value)}
						disabled={loading}
						maxLength={200}
					/>
					<ActionButton
						label={loading ? "Translating..." : "Generate Cron"}
						disabled={!english.trim() || loading}
						onClick={handleGenerate}
						className={isPressed ? "scale-95" : ""}
						onMouseDown={() => setIsPressed(true)}
						onMouseUp={() => setIsPressed(false)}
						onMouseLeave={() => setIsPressed(false)}
						onTouchStart={() => setIsPressed(true)}
						onTouchEnd={() => setIsPressed(false)}
					/>
				</div>
				{error && (
					<div className="mt-4 w-full">
						<div className="bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-lg p-4 w-full text-center">
							<span>{error}</span>
						</div>
					</div>
				)}
			</div>

			{cron && (
				<div className="mb-8">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-xl font-semibold text-base-content">
							Generated Cron:
						</h3>
						<CopyButton
							value={cron}
							label="Copy"
							disabled={!cron}
							className="btn-sm"
						/>
					</div>
					<div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[96px] flex items-center">
						<p className="text-xl text-black font-medium leading-relaxed w-full text-center">
							{cron}
						</p>
					</div>
				</div>
			)}

			<NextRuns cron={cron} disabled={!cron} />
		</div>
	);
}
