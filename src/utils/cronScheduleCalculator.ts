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

export async function calculateNextRuns(
	cron: string,
	lang: string,
): Promise<CronCalculationResult> {
	try {
		const hasAmbiguousSchedule = detectAmbiguousSchedule(cron);

		// Dynamic import of cron-parser
		const mod = await import("cron-parser");
		const parser = mod.default;

		if (!parser) {
			throw new Error("cron-parser not loaded");
		}

		const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
		const interval = parser.parse(cron, { tz });
		const nextDates: string[] = [];

		for (let i = 0; i < 5; i++) {
			const date = interval.next().toDate();
			nextDates.push(
				date.toLocaleString(lang, {
					weekday: "long",
					year: "numeric",
					month: "long",
					day: "numeric",
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
					timeZoneName: "long",
				}),
			);
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
