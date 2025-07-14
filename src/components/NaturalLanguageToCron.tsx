import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
	const { t, i18n } = useTranslation();
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
				const result = await translateToCron(naturalLanguage, i18n.language);

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
					lastError = new Error(t("naturalLanguage.unexpectedError"));
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
			<div className="mb-8 flex w-full flex-col">
				<div className="mb-6 flex w-full items-center justify-between">
					<span className="block font-semibold text-black text-xl dark:text-gray-100">
						{t("naturalLanguage.title")}
					</span>
					<ModeToggle />
				</div>
				<div className="relative flex w-full flex-col gap-4">
					<textarea
						id="natural-language-input"
						className="textarea textarea-bordered max-h-32 min-h-[6rem] w-full resize-none rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 font-mono text-gray-900 text-lg placeholder-gray-500 transition-colors duration-200 hover:border-gray-400 focus:border-gray-600 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-50 dark:placeholder-gray-400 dark:focus:border-neutral-400 dark:hover:border-neutral-500"
						placeholder={t("naturalLanguage.inputPlaceholder")}
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
									? t("naturalLanguage.rateLimited")
									: loading
										? t("naturalLanguage.translating")
										: t("naturalLanguage.generateCron")
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
						<div className="w-full rounded-xl border border-red-300 bg-red-100 p-4 text-center text-red-700 dark:border-red-700 dark:bg-red-900 dark:text-red-300">
							<span>{rateLimitMsg || t("naturalLanguage.rateLimitedMsg")}</span>
						</div>
					</div>
				)}
				{retrying && (
					<div className="mt-4 w-full">
						<div className="w-full animate-pulse rounded-xl border border-neutral-300 bg-neutral-100 p-4 text-center text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
							<span>{t("naturalLanguage.retrying")}</span>
						</div>
					</div>
				)}
				{error && !retrying && !rateLimited && (
					<div className="mt-4 w-full">
						<div className="w-full rounded-xl border border-yellow-300 bg-yellow-100 p-4 text-center text-yellow-700 dark:border-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
							<span>{error}</span>
						</div>
					</div>
				)}
			</div>

			{cron && !retrying && !rateLimited && (
				<div className="mb-8">
					<div className="mb-4 flex items-center justify-between">
						<h3 className="font-semibold text-black text-xl dark:text-gray-100">
							{t("naturalLanguage.generatedCron")}
						</h3>
						<CopyButton
							value={cron}
							label={t("naturalLanguage.copy")}
							disabled={!cron}
							className="btn-sm"
						/>
					</div>
					<div className="flex min-h-[96px] items-center rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-700 dark:bg-neutral-700">
						<p className="w-full text-center font-medium text-black text-xl leading-relaxed dark:text-gray-100">
							{cron}
						</p>
					</div>
				</div>
			)}

			<NextRuns cron={cron} disabled={!cron || retrying || rateLimited} />
		</div>
	);
}
