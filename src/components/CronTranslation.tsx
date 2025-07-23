import type { FC } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useKroniloStore } from "../stores/useKroniloStore";
import type { CronTranslationProps } from "../types/components";
import { CopyButton } from "./CopyButton";

export const CronTranslation: FC<CronTranslationProps> = ({ cron }) => {
	const { t, i18n } = useTranslation();
	const lang = (i18n.language || "en").split("-")[0];
	const [translation, setTranslation] = useState<string>("");
	const [error, setError] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState(false);
	const incrementCronToNaturalUsage = useKroniloStore(
		(s) => s.incrementCronToNaturalUsage,
	);

	type CronstrueType = typeof import("cronstrue");
	const cronstrueRef = useRef<CronstrueType["default"] | null>(null);
	const loadedLocales = useRef<{ [key: string]: boolean }>({});
	const translateCron = useCallback(async () => {
		try {
			if (!cronstrueRef.current) {
				const mod = await import("cronstrue");
				cronstrueRef.current = mod.default;
			}
			const cronstrue = cronstrueRef.current;
			if (!cronstrue) {
				throw new Error("cronstrue not loaded");
			}
			if (!loadedLocales.current[lang]) {
				if (lang === "fr") await import("cronstrue/locales/fr");
				else if (lang === "es") await import("cronstrue/locales/es");
				else if (lang === "de") await import("cronstrue/locales/de");
				loadedLocales.current[lang] = true;
			}
			const result = cronstrue.toString(cron, {
				throwExceptionOnParseError: true,
				locale: ["en", "fr", "es", "de"].includes(lang) ? lang : "en",
			});
			setTranslation(result);
			setError(undefined);
			incrementCronToNaturalUsage();
		} catch (e) {
			setTranslation("");
			setError(e instanceof Error ? e.message : "Invalid cron expression");
		}
		setLoading(false);
	}, [cron, lang, incrementCronToNaturalUsage]);

	useEffect(() => {
		if (!cron.trim()) {
			setTranslation("");
			setError(undefined);
			setLoading(false);
			return;
		}
		setLoading(true);
		const timeout = setTimeout(() => {
			translateCron();
		}, 500);
		return () => clearTimeout(timeout);
	}, [cron, translateCron]);

	return (
		<div className="mb-8">
			<div className="mb-4 flex items-center justify-between">
				<h3 className="font-semibold text-black text-lg sm:text-xl md:text-2xl dark:text-neutral-50">
					{t("translation.title")}
				</h3>
				<CopyButton
					value={translation}
					label={t("actions.copy")}
					disabled={!translation || !cron.trim()}
					className="btn-sm"
				/>
			</div>
			<div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-neutral-600 dark:bg-neutral-700 min-h-[4rem]">
				{!cron.trim() ? (
					<div className="flex items-center justify-center h-12">
						<span className="text-gray-500 text-lg dark:text-gray-300">
							{t("translation.placeholder")}
						</span>
					</div>
				) : error ? (
					<div className="rounded-xl border border-yellow-300 bg-yellow-100 p-4 text-yellow-700 dark:border-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
						<span>{error}</span>
					</div>
				) : loading ? (
					<div className="flex items-center gap-2 font-medium text-black text-xl leading-relaxed dark:text-neutral-50 h-12">
						<span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent dark:border-neutral-50 dark:border-t-transparent"></span>
						{t("translation.loading")}
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
