/**
 * CRON_SUGGESTIONS
 *
 * Small, curated list of common cron expressions and human-readable
 * descriptions shown in the suggestions dropdown. Declared `as const` so
 * callers can rely on literal types.
 */
export const CRON_SUGGESTIONS = [
	{ expression: "*/5 * * * *", description: "Every 5 minutes" },
	{ expression: "0 * * * *", description: "Every hour" },
	{ expression: "0 0 * * *", description: "Every day at midnight" },
	{ expression: "0 9 * * 1-5", description: "Every weekday at 9 AM" },
	{ expression: "0 0 1 * *", description: "First day of every month" },
	{ expression: "0 0 * * 0", description: "Every Sunday at midnight" },
] as const;
