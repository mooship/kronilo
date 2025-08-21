import { z } from "zod";
import { cronSchema } from "./cron";

/**
 * persistedSchema
 * Small Zod schema describing the persisted pieces we keep in localStorage.
 * We keep the human-friendly cron string (validated via `cronSchema`) and
 * an optional ISO datetime for the dismissed-until value.
 */
export const persistedSchema = z.object({
	cron: z
		.string()
		.optional()
		.refine((c) => (c === undefined ? true : cronSchema.safeParse(c).success), {
			message: "Invalid cron",
		}),
	dismissedUntil: z
		.string()
		.nullable()
		.optional()
		.refine((s) => (s == null ? true : !Number.isNaN(Date.parse(s))), {
			message: "Invalid date",
		}),
});
