import cronstrue from "cronstrue";
import { useEffect, useState } from "react";
import { useKroniloStore } from "../store";
import { CopyButton } from "./CopyButton";

interface CronTranslationProps {
	cron: string;
}

export function CronTranslation({ cron }: CronTranslationProps) {
	const [translation, setTranslation] = useState<string>("");
	const [error, setError] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState(false);
	const incrementUsage = useKroniloStore((s) => s.incrementUsage);

	useEffect(() => {
		if (!cron.trim()) {
			setTranslation("");
			setError(undefined);
			setLoading(false);
			return;
		}

		setLoading(true);
		const timer = setTimeout(() => {
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
		}, 500);

		return () => {
			clearTimeout(timer);
			setLoading(false);
		};
	}, [cron, incrementUsage]);

	if (!cron.trim()) {
		return (
			<div className="mb-8">
				<div className="bg-base-300/50 rounded-xl p-6 text-center">
					<span className="text-base-content/60 text-lg">
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
				<div className="bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 rounded-xl p-4">
					<span>{error}</span>
				</div>
			) : (
				<div className="bg-primary/10 border border-primary/30 rounded-xl p-6">
					{loading ? (
						<div className="flex items-center gap-2 text-xl text-base-content font-medium leading-relaxed">
							<span className="animate-spin inline-block w-5 h-5 border-2 border-primary border-t-transparent rounded-full"></span>
							Translating...
						</div>
					) : (
						<p className="text-xl text-base-content font-medium leading-relaxed">
							{translation}
						</p>
					)}
				</div>
			)}
		</div>
	);
}
