import cronstrue from "cronstrue";
import type { FC } from "react";
import { useEffect, useState } from "react";
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

	const translateCron = () => {
		try {
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

	const [, cancel, reset] = useTimeoutFn(translateCron, 500);

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

	if (!cron.trim()) {
		return (
			<div className="mb-8">
				<div className="bg-gray-50 rounded-xl p-6 text-center dark:bg-neutral-700">
					<span className="text-gray-500 text-lg dark:text-gray-300">
						Enter a cron expression to see the translation
					</span>
				</div>
			</div>
		);
	}

	return (
		<div className="mb-8">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-xl font-semibold text-black dark:text-neutral-50">
					Translation:
				</h3>
				<CopyButton
					value={translation}
					label="Copy"
					disabled={!translation}
					className="btn-sm"
				/>
			</div>
			{error ? (
				<div className="bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-xl p-4 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-300">
					<span>{error}</span>
				</div>
			) : (
				<div className="bg-gray-50 border border-gray-200 rounded-xl p-6 dark:bg-neutral-700 dark:border-neutral-600">
					{loading ? (
						<div className="flex items-center gap-2 text-xl text-black font-medium leading-relaxed dark:text-neutral-50">
							<span className="animate-spin inline-block w-5 h-5 border-2 border-black border-t-transparent rounded-full dark:border-neutral-50 dark:border-t-transparent"></span>
							Translating...
						</div>
					) : (
						<p className="text-xl text-black font-medium leading-relaxed dark:text-neutral-50">
							{translation}
						</p>
					)}
				</div>
			)}
		</div>
	);
};
