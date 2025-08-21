import { z } from "zod";

/**
 * KroniloStoreSchema
 *
 * Zod schema for the persistent parts of the Kronilo Zustand store.
 * Ensures type safety and validation for store persistence and hydration.
 */
export const KroniloStoreSchema = z.object({
	donationModalOpen: z.boolean(),
	cronToNaturalUsageCount: z.number().int().nonnegative(),
	dismissedUntil: z.union([z.date(), z.null()]),
	cron: z.string(),
});

export type KroniloStore = z.infer<typeof KroniloStoreSchema>;
