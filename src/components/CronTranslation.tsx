import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import { useTimeoutFn } from "react-use";
import { useKroniloStore } from "../store";
import type { CronTranslationProps } from "../types/components";
import { CopyButton } from "./CopyButton";

/**
 * Component that translates cron expressions into human-readable descriptions.
 * Uses the cronstrue library to convert cron syntax into natural language.
 * Includes debounced translation, loading states, and error handling.
 *
 * @param cron - The cron expression to translate into human-readable text
 *
 * @example
 * ```tsx
 * <CronTranslation cron="0 9 * * 1-5" />
 * // Displays: "At 09:00 AM, Monday through Friday"
 * ```
 */
export const CronTranslation: FC<CronTranslationProps> = ({ cron }) => {
	const [translation, setTranslation] = useState<string>("");
	const [error, setError] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState(false);
	const incrementCronToNaturalUsage = useKroniloStore(
		(s) => s.incrementCronToNaturalUsage,
	);

	type CronstrueType = typeof import("cronstrue");
	const cronstrueRef = useRef<CronstrueType["default"] | null>(null);
	const translateCron = async () => {
		try {
			if (!cronstrueRef.current) {
				const mod = await import("cronstrue");
				cronstrueRef.current = mod.default;
			}
			const cronstrue = cronstrueRef.current;
			if (!cronstrue) {
				throw new Error("cronstrue not loaded");
			}
			const result = cronstrue.toString(cron, {
				throwExceptionOnParseError: true,
			});
			setTranslation(result);
			setError(undefined);
			incrementCronToNaturalUsage();
		} catch (e) {
			setTranslation("");
			setError(e instanceof Error ? e.message : "Invalid cron expression");
		}
		setLoading(false);
	};

	const [, cancel, reset] = useTimeoutFn(() => {
		translateCron();
	}, 500);

	useEffect(() => {
		if (!cron.trim()) {
			setTranslation("");
			setError(undefined);
			setLoading(false);
			cancel();
			return;
		}

		setLoading(true);
		reset();
	}, [cron, cancel, reset]);

	return (
		<div className="mb-8">
			<div className="mb-4 flex items-center justify-between">
				<h3 className="font-semibold text-black text-xl dark:text-neutral-50">
					Translation:
				</h3>
				<CopyButton
					value={translation}
					label="Copy"
					disabled={!translation || !cron.trim()}
					className="btn-sm"
				/>
			</div>
			<div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-neutral-600 dark:bg-neutral-700 min-h-[4rem]">
				{!cron.trim() ? (
					<div className="flex items-center justify-center h-12">
						<span className="text-gray-500 text-lg dark:text-gray-300">
							Enter a cron expression to see the translation
						</span>
					</div>
				) : error ? (
					<div className="rounded-xl border border-yellow-300 bg-yellow-100 p-4 text-yellow-700 dark:border-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
						<span>{error}</span>
					</div>
				) : loading ? (
					<div className="flex items-center gap-2 font-medium text-black text-xl leading-relaxed dark:text-neutral-50 h-12">
						<span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent dark:border-neutral-50 dark:border-t-transparent"></span>
						Translating...
					</div>
				) : (
					<p className="font-medium text-black text-xl leading-relaxed dark:text-neutral-50 min-h-[3rem] flex items-center">
						{translation}
					</p>
				)}
			</div>
		</div>
	);
};
