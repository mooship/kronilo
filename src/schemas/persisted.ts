import { z } from "zod";
import { cronSchema } from "./cron";

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
