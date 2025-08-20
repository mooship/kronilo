import type { FC } from "react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useUnmount } from "usehooks-ts";
import { getLocaleConfig, LOCALES } from "../../locales";
import "cronstrue/locales/fr";
import "cronstrue/locales/es";
import "cronstrue/locales/de";
import "cronstrue/locales/it";
import "cronstrue/locales/nl";
import "cronstrue/locales/pt_BR";
import "cronstrue/locales/pt_PT";
import "cronstrue/locales/pl";
import "cronstrue/locales/sv";
import "cronstrue/locales/da";
import "cronstrue/locales/nb";
import "cronstrue/locales/fi";
import "cronstrue/locales/uk";
import "cronstrue/locales/ro";
import "cronstrue/locales/tr";
import "cronstrue/locales/cs";
import "cronstrue/locales/af";
import "cronstrue/locales/ru";
import { useKroniloStore } from "../../stores/useKroniloStore";
import type {
	CronstrueType,
	CronTranslationProps,
} from "../../types/components";
import { MemoizedCopyButton } from "../ui/CopyButton";

/**
 * CronTranslation
 *
 * Converts a cron expression into a human-readable natural language sentence
 * using the `cronstrue` library. The component lazy-loads `cronstrue` to keep
 * initial bundle size small and re-renders when the `cron` prop or user's
 * language changes. It debounces translations by 500ms to avoid spamming
 * expensive conversions while the user types.
 *
 * Accessibility: when no cron is provided a helpful placeholder is shown;
 * when translation is in progress a loading indicator is displayed.
 *
 * Props
 * @param {string} cron - The cron expression to translate.
 */
const CronTranslation: FC<CronTranslationProps> = ({ cron }) => {
	const { t, i18n } = useTranslation();
	const lang = (i18n.language || "en").split("-")[0];
	const [translation, setTranslation] = useState<string>("");
	const [error, setError] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState(false);
	const incrementCronToNaturalUsage = useKroniloStore(
		(s) => s.incrementCronToNaturalUsage,
	);

	const cronstrueRef = useRef<CronstrueType["default"] | null>(null);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useUnmount(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
	});
	const CRONSTRUE_LOCALES: string[] = useMemo(
		() =>
			LOCALES.filter((l) => typeof l.cronstrueLocale === "string").map((l) =>
				String(l.cronstrueLocale),
			),
		[],
	);

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
			const config = getLocaleConfig(i18n.language) || getLocaleConfig(lang);
			const cronstrueLocale = config?.cronstrueLocale || "en";
			const result = cronstrue.toString(cron, {
				throwExceptionOnParseError: true,
				locale: CRONSTRUE_LOCALES.includes(cronstrueLocale)
					? cronstrueLocale
					: "en",
			});
			setTranslation(result);
			setError(undefined);
			incrementCronToNaturalUsage();
		} catch (e) {
			setTranslation("");
			setError(e instanceof Error ? e.message : "Invalid cron expression");
		}
		setLoading(false);
	}, [
		cron,
		lang,
		i18n.language,
		incrementCronToNaturalUsage,
		CRONSTRUE_LOCALES,
	]);

	useEffect(() => {
		if (!cron.trim()) {
			setTranslation("");
			setError(undefined);
			setLoading(false);
			return;
		}

		setLoading(true);
		timeoutRef.current = setTimeout(() => {
			translateCron();
		}, 500);
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [cron, translateCron]);

	return (
		<div className="mb-8">
			<div className="mb-4 flex items-center justify-between">
				<h3 className="font-semibold text-foreground text-lg sm:text-xl md:text-2xl">
					{t("translation.title")}
				</h3>
				<MemoizedCopyButton
					value={translation}
					label={t("actions.copy")}
					disabled={!translation || !cron.trim()}
					className="btn-sm"
				/>
			</div>
			<div className="rounded-xl border border-border bg-background-secondary p-6 min-h-[4rem]">
				{!cron.trim() ? (
					<div className="flex items-center justify-center h-12">
						<span className="text-foreground-secondary text-lg">
							{t("translation.placeholder")}
						</span>
					</div>
				) : loading ? (
					<div className="flex items-center gap-2 font-medium text-foreground text-xl leading-relaxed h-12">
						<span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-foreground border-t-transparent"></span>
						{t("translation.loading")}
					</div>
				) : error ? (
					<p className="font-medium text-foreground text-xl leading-relaxed min-h-[3rem] flex items-center">
						{error}
					</p>
				) : (
					<p className="font-medium text-foreground text-xl leading-relaxed min-h-[3rem] flex items-center">
						{translation}
					</p>
				)}
			</div>
		</div>
	);
};

export const MemoizedCronTranslation = memo(CronTranslation);
