import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePressAnimation } from "../hooks/usePressAnimation";
import { useRateLimit, useTranslateToCron } from "../hooks/useTranslateQuery";
import { useKroniloStore } from "../stores/useKroniloStore";
import { MemoizedActionButton } from "./ActionButton";
import { MemoizedCopyButton } from "./CopyButton";
import { MemoizedModeToggle } from "./ModeToggle";
import { MemoizedNextRuns } from "./NextRuns";

export function NaturalLanguageToCron() {
	const { t } = useTranslation();
	const [naturalLanguage, setNaturalLanguage] = useState("");
	const [cron, setCron] = useState("");
	const { data: rateLimitData } = useRateLimit();
	const translateMutation = useTranslateToCron();
	const incrementNaturalToCronUsage = useKroniloStore(
		(s) => s.incrementNaturalToCronUsage,
	);
	const actionAnim = usePressAnimation();

	const rateLimited = rateLimitData?.rateLimited ?? false;
	const rateLimitMsg =
		typeof rateLimitData?.details === "string"
			? rateLimitData.details
			: JSON.stringify(rateLimitData?.details ?? "");
	const loading = translateMutation.isPending;
	const retrying =
		translateMutation.isError && translateMutation.failureCount < 2;
	const error = translateMutation.error?.message;

	async function handleGenerate() {
		if (!naturalLanguage.trim()) {
			return;
		}

		try {
			const result = await translateMutation.mutateAsync(naturalLanguage);
			setCron(result.cron);
			incrementNaturalToCronUsage();
		} catch {}
	}

	return (
		<div className="flex flex-col gap-8">
			<div className="mb-8 flex w-full flex-col">
				<div className="mb-6 flex w-full items-center justify-between">
					<span className="block font-semibold text-black text-xl dark:text-gray-100">
						{t("naturalLanguage.title")}
					</span>
					<MemoizedModeToggle />
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
						<MemoizedActionButton
							label={
								rateLimited
									? t("actions.rateLimited")
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
						<MemoizedCopyButton
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

			<MemoizedNextRuns
				cron={cron}
				disabled={!cron || retrying || rateLimited}
			/>
		</div>
	);
}
