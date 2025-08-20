/**
 * CronCalculationResult
 *
 * Returned by the cron schedule calculator utility. `runs` contains
 * human-readable timestamps, `error` carries an optional message, and
 * `hasAmbiguousSchedule` is set when DST/ambiguity may affect the schedule.
 */
export interface CronCalculationResult {
	runs: string[];
	error: string | null;
	hasAmbiguousSchedule: boolean;
}
