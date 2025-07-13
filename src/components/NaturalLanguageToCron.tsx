import { useEffect, useState } from "react";
import { checkRateLimit, translateToCron } from "../api/translateToCron";
import { usePressAnimation } from "../hooks/usePressAnimation";
import { useKroniloStore } from "../store";
import { ActionButton } from "./ActionButton";
import { CopyButton } from "./CopyButton";
import { ModeToggle } from "./ModeToggle";
import { NextRuns } from "./NextRuns";

/**
 * Component for converting natural language descriptions into cron expressions.
 * Features rate limiting checks, retry logic, and real-time validation.
 * Integrates with the API service to translate natural language into cron syntax.
 *
 * Donation Modal Logic:
 * - Triggers after 2 successful natural language → cron translations (mode-specific counter).
 * - Counter is incremented only after a successful translation.
 * - Modal postponement is handled globally ("Maybe Later" sets a 14-day delay).
 *
 * @example
 * ```tsx
 * <NaturalLanguageToCron />
 * // User can enter: "every day at 9am"
 * // Result: "0 9 * * *"
 * ```
 */
export function NaturalLanguageToCron() {
	const [naturalLanguage, setNaturalLanguage] = useState("");
	const [cron, setCron] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [retrying, setRetrying] = useState(false);
	const rateLimited = useKroniloStore((s) => s.rateLimited);
	const rateLimitMsg = useKroniloStore((s) => s.rateLimitMsg);
	const setRateLimited = useKroniloStore((s) => s.setRateLimited);
	const incrementNaturalToCronUsage = useKroniloStore(
		(s) => s.incrementNaturalToCronUsage,
	);
	const actionAnim = usePressAnimation();

	useEffect(() => {
		async function checkLimit() {
			const res = await checkRateLimit();
			setRateLimited(
				res.rateLimited,
				typeof res.details === "string"
					? res.details
					: JSON.stringify(res.details ?? ""),
			);
		}
		checkLimit();

		let interval: number | null = null;
		if (rateLimited) {
			interval = window.setInterval(() => {
				checkLimit();
			}, 30000);
		}

		return () => {
			if (interval) window.clearInterval(interval);
		};
	}, [setRateLimited, rateLimited]);

	async function handleGenerate() {
		setError(null);
		setCron("");
		setLoading(true);
		setRetrying(false);
		let attempt = 0;
		let lastError: Error | null = null;
		const limitRes = await checkRateLimit();
		setRateLimited(
			limitRes.rateLimited,
			typeof limitRes.details === "string"
				? limitRes.details
				: JSON.stringify(limitRes.details ?? ""),
		);
		if (limitRes.rateLimited) {
			setLoading(false);
			return;
		}
		while (attempt < 2) {
			try {
				const result = await translateToCron(naturalLanguage);

				if (result.status === 429 && result.rateLimitType) {
					setRateLimited(true, result.error || "Rate limit exceeded");
					setLoading(false);
					setRetrying(false);
					return;
				}

				if (result.data?.cron) {
					setCron(result.data.cron);
					incrementNaturalToCronUsage();
					setLoading(false);
					setRetrying(false);
					return;
				} else if (result.error) {
					if (
						result.status >= 400 &&
						result.status < 500 &&
						result.status !== 408
					) {
						setError(result.error);
						setLoading(false);
						setRetrying(false);
						return;
					}
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
				<div className="flex items-center justify-between mb-6 w-full">
					<span className="block text-xl font-semibold text-black dark:text-gray-100">
						Natural Language Schedule
					</span>
					<ModeToggle />
				</div>
				<div className="relative flex flex-col gap-4 w-full">
					<textarea
						id="natural-language-input"
						className="textarea textarea-bordered bg-gray-50 text-gray-900 placeholder-gray-500 font-mono text-lg px-4 py-3 w-full rounded-xl border-2 transition-colors duration-200 focus:outline-none border-gray-200 hover:border-gray-400 focus:border-gray-600 resize-none min-h-[6rem] max-h-32 dark:bg-neutral-800 dark:text-neutral-50 dark:placeholder-gray-400 dark:border-neutral-700 dark:hover:border-neutral-500 dark:focus:border-neutral-400"
						placeholder={`e.g. “run once a week on a Thursday” — Works best in: English, German, Spanish, French, Italian, Dutch, Swedish, Norwegian, Danish, Indonesian, and Turkish. Support for other languages may vary.`}
						value={naturalLanguage}
						onChange={(e) => setNaturalLanguage(e.target.value)}
						disabled={loading || rateLimited}
						maxLength={200}
						rows={3}
						onInput={(e) => {
							const target = e.target as HTMLTextAreaElement;
							target.style.height = "auto";
							target.style.height = `${Math.min(target.scrollHeight, 256)}px`;
						}}
					/>
					<div className="flex justify-center">
						<ActionButton
							label={
								rateLimited
									? "Rate Limited"
									: loading
										? "Translating..."
										: "Generate Cron"
							}
							disabled={
								loading || naturalLanguage.trim().length === 0 || rateLimited
							}
							onClick={handleGenerate}
							className={actionAnim.isPressed ? "scale-95" : ""}
							onMouseDown={actionAnim.handlePressStart}
							onMouseUp={actionAnim.handlePressEnd}
							onMouseLeave={actionAnim.handlePressEnd}
							onTouchStart={actionAnim.handlePressStart}
							onTouchEnd={actionAnim.handlePressEnd}
						/>
					</div>
				</div>
				{rateLimited && (
					<div className="mt-4 w-full">
						<div className="bg-red-100 border border-red-300 text-red-700 rounded-xl p-4 w-full text-center dark:bg-red-900 dark:border-red-700 dark:text-red-300">
							<span>
								{rateLimitMsg ||
									"You are currently rate limited. Please try again later."}
							</span>
						</div>
					</div>
				)}
				{retrying && (
					<div className="mt-4 w-full">
						<div className="bg-neutral-100 border border-neutral-300 text-neutral-700 rounded-xl p-4 w-full text-center animate-pulse dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300">
							<span>Please wait, retrying...</span>
						</div>
					</div>
				)}
				{error && !retrying && !rateLimited && (
					<div className="mt-4 w-full">
						<div className="bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-xl p-4 w-full text-center dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-300">
							<span>{error}</span>
						</div>
					</div>
				)}
			</div>

			{cron && !retrying && !rateLimited && (
				<div className="mb-8">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-xl font-semibold text-black dark:text-gray-100">
							Generated Cron:
						</h3>
						<CopyButton
							value={cron}
							label="Copy"
							disabled={!cron}
							className="btn-sm"
						/>
					</div>
					<div className="bg-gray-50 border border-gray-200 rounded-xl p-4 min-h-[96px] flex items-center dark:bg-gray-800 dark:border-gray-700">
						<p className="text-xl text-black font-medium leading-relaxed w-full text-center dark:text-gray-100">
							{cron}
						</p>
					</div>
				</div>
			)}

			<NextRuns cron={cron} disabled={!cron || retrying || rateLimited} />
		</div>
	);
}
