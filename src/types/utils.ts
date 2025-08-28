export interface CronCalculationResult {
	runs: string[];
	error: string | null;
	hasAmbiguousSchedule: boolean;
}
