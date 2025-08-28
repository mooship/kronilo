import { z } from "zod";

export const KroniloStoreSchema = z.object({
	donationModalOpen: z.boolean(),
	cronToNaturalUsageCount: z.number().int().nonnegative(),
	dismissedUntil: z.union([z.date(), z.null()]),
	cron: z.string(),
});

export type KroniloStore = z.infer<typeof KroniloStoreSchema>;
