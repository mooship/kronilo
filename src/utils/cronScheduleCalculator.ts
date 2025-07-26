import type { CronCalculationResult } from "../types";
import { WHITESPACE_REGEX } from "./cronValidation";

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
