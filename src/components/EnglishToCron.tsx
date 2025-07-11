import { useEffect, useState } from "react";
import { checkRateLimit, translateToCron } from "../api/translateToCron";
import { useKroniloStore } from "../store";
import { ActionButton } from "./ActionButton";
import { CopyButton } from "./CopyButton";
import { NextRuns } from "./NextRuns";

export function EnglishToCron() {
	const [english, setEnglish] = useState("");
	const [cron, setCron] = useState("");
	const [isPressed, setIsPressed] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [retrying, setRetrying] = useState(false);
	const rateLimited = useKroniloStore((s) => s.rateLimited);
	const rateLimitMsg = useKroniloStore((s) => s.rateLimitMsg);
	const setRateLimited = useKroniloStore((s) => s.setRateLimited);

	useEffect(() => {
		async function checkLimit() {
			const res = await checkRateLimit();
			setRateLimited(res.rateLimited, res.message || null);
		}
		checkLimit();
	}, [setRateLimited]);

	async function handleGenerate() {
		setError(null);
		setCron("");
		setLoading(true);
		setRetrying(false);
		let attempt = 0;
		let lastError: Error | null = null;
		const limitRes = await checkRateLimit();
		setRateLimited(limitRes.rateLimited, limitRes.message || null);
		if (limitRes.rateLimited) {
			setLoading(false);
			return;
		}
		while (attempt < 2) {
			try {
				const result = await translateToCron(english);
				if (result.data?.cron) {
					setCron(result.data.cron);
					setLoading(false);
					setRetrying(false);
					return;
				} else if (result.error) {
					lastError = new Error(result.error);
					throw lastError;
				} else {
					lastError = new Error(
						"An unexpected error occurred. Please try again.",
					);
					throw lastError;
				}
			} catch (err) {
				lastError = err instanceof Error ? err : new Error(String(err));
				attempt++;
				if (attempt < 2) {
					setRetrying(true);
					await new Promise((res) => setTimeout(res, 500));
					setRetrying(false);
				}
			}
		}
		setError(lastError ? lastError.message : "Unknown error");
		setLoading(false);
		setRetrying(false);
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
						disabled={loading || rateLimited}
						maxLength={200}
					/>
					<ActionButton
						label={
							rateLimited
								? "Rate Limited"
								: loading
									? "Translating..."
									: "Generate Cron"
						}
						disabled={loading || english.trim().length === 0 || rateLimited}
						onClick={handleGenerate}
						className={isPressed ? "scale-95" : ""}
						onMouseDown={() => setIsPressed(true)}
						onMouseUp={() => setIsPressed(false)}
						onMouseLeave={() => setIsPressed(false)}
						onTouchStart={() => setIsPressed(true)}
						onTouchEnd={() => setIsPressed(false)}
					/>
				</div>
				{rateLimited && (
					<div className="mt-4 w-full">
						<div className="bg-red-100 border border-red-300 text-red-700 rounded-lg p-4 w-full text-center">
							<span>
								{rateLimitMsg ||
									"You are currently rate limited. Please try again later."}
							</span>
						</div>
					</div>
				)}
				{retrying && (
					<div className="mt-4 w-full">
						<div className="bg-blue-100 border border-blue-300 text-blue-700 rounded-lg p-4 w-full text-center animate-pulse">
							<span>Please wait, retrying...</span>
						</div>
					</div>
				)}
				{error && !retrying && !rateLimited && (
					<div className="mt-4 w-full">
						<div className="bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-lg p-4 w-full text-center">
							<span>{error}</span>
						</div>
					</div>
				)}
			</div>

			{cron && !retrying && !rateLimited && (
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

			<NextRuns cron={cron} disabled={!cron || retrying || rateLimited} />
		</div>
	);
}
