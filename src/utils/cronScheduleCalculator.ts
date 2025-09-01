import { try as radashTry, range } from "radash";
import type { CronCalculationResult } from "../types";
import { isValidCronFormat, WHITESPACE_REGEX } from "./cronValidation";

export function detectAmbiguousSchedule(cron: string): boolean {
	const cronParts = cron.trim().split(WHITESPACE_REGEX);

	if (cronParts.length < 5) {
		return false;
	}

	const dayOfMonth = cronParts[2];
	const dayOfWeek = cronParts[4];

	return (
		dayOfMonth !== "*" &&
		dayOfWeek !== "*" &&
		!dayOfMonth.includes("/") &&
		!dayOfWeek.includes("/") &&
		!dayOfMonth.includes("-") &&
		!dayOfWeek.includes("-") &&
		!dayOfMonth.includes(",") &&
		!dayOfWeek.includes(",")
	);
}

const NEXT_RUNS_COUNT = 5;
const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
	weekday: "long",
	year: "numeric",
	month: "long",
	day: "numeric",
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit",
	timeZoneName: "long",
};

export async function calculateNextRuns(
	cron: string,
	lang: string,
): Promise<CronCalculationResult> {
	if (!isValidCronFormat(cron)) {
		return {
			runs: [],
			error: "Invalid cron expression",
			hasAmbiguousSchedule: false,
		};
	}

	const [err, result] = await radashTry(async () => {
		const hasAmbiguousSchedule = detectAmbiguousSchedule(cron);
		const mod = await import("cron-parser");
		const parser = mod.default;
		if (!parser) {
			throw new Error("cron-parser not loaded");
		}
		const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
		const interval = parser.parse(cron, { tz });
		const nextDates: string[] = [];
		for (const _ of range(0, NEXT_RUNS_COUNT - 1)) {
			const date = interval.next().toDate();
			nextDates.push(date.toLocaleString(lang, DATE_FORMAT_OPTIONS));
		}
		return {
			runs: nextDates,
			error: null,
			hasAmbiguousSchedule,
		};
	})();

	if (err) {
		return {
			runs: [],
			error: err instanceof Error ? err.message : "Invalid cron expression",
			hasAmbiguousSchedule: false,
		};
	}
	return (
		result ?? { runs: [], error: "Unknown error", hasAmbiguousSchedule: false }
	);
}
