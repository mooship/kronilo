import type { CronCalculationResult } from "../types";
import { isValidCronFormat, WHITESPACE_REGEX } from "./cronValidation";

/**
 * detectAmbiguousSchedule
 *
 * Heuristic to detect when a cron expression might be ambiguous because both
 * day-of-month and day-of-week are specified (and neither uses ranges, lists
 * or steps). This is useful to warn users when DST or overlapping rules could
 * produce surprising results.
 *
 * @param cron - cron expression string
 * @returns boolean - true when the schedule is considered ambiguous
 */
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

/**
 * calculateNextRuns
 *
 * Asynchronously calculates the next run timestamps for a cron expression.
 * Uses `cron-parser` via dynamic import to avoid including it in the initial
 * bundle. Returns formatted, localized timestamp strings and flags whether
 * the schedule may be ambiguous.
 *
 * @param cron - cron expression
 * @param lang - locale used for `toLocaleString` formatting
 * @returns Promise<CronCalculationResult> containing runs, optional error and
 *          ambiguity flag
 */
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
	try {
		const hasAmbiguousSchedule = detectAmbiguousSchedule(cron);

		const mod = await import("cron-parser");
		const parser = mod.default;

		if (!parser) {
			throw new Error("cron-parser not loaded");
		}

		const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
		const interval = parser.parse(cron, { tz });
		const nextDates: string[] = [];

		for (let i = 0; i < NEXT_RUNS_COUNT; i++) {
			const date = interval.next().toDate();
			nextDates.push(date.toLocaleString(lang, DATE_FORMAT_OPTIONS));
		}

		return {
			runs: nextDates,
			error: null,
			hasAmbiguousSchedule,
		};
	} catch (e) {
		return {
			runs: [],
			error: e instanceof Error ? e.message : "Invalid cron expression",
			hasAmbiguousSchedule: false,
		};
	}
}
