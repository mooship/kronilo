import cronstrue from "cronstrue";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useTimeoutFn } from "react-use";
import { useKroniloStore } from "../store";
import { CopyButton } from "./CopyButton";

interface CronTranslationProps {
	cron: string;
}

export const CronTranslation: FC<CronTranslationProps> = ({ cron }) => {
	const [translation, setTranslation] = useState<string>("");
	const [error, setError] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState(false);
	const incrementUsage = useKroniloStore((s) => s.incrementUsage);

	const translateCron = () => {
		try {
			const result = cronstrue.toString(cron, {
				throwExceptionOnParseError: true,
			});
			setTranslation(result);
			setError(undefined);
			incrementUsage();
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
				<div className="bg-gray-50 rounded-xl p-6 text-center">
					<span className="text-gray-500 text-lg">
						Enter a cron expression to see the translation
					</span>
				</div>
			</div>
		);
	}

	return (
		<div className="mb-8">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-xl font-semibold text-base-content">
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
				<div className="bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-xl p-4">
					<span>{error}</span>
				</div>
			) : (
				<div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
					{loading ? (
						<div className="flex items-center gap-2 text-xl text-black font-medium leading-relaxed">
							<span className="animate-spin inline-block w-5 h-5 border-2 border-black border-t-transparent rounded-full"></span>
							Translating...
						</div>
					) : (
						<p className="text-xl text-black font-medium leading-relaxed">
							{translation}
						</p>
					)}
				</div>
			)}
		</div>
	);
};
