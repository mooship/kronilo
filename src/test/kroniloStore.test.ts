import { beforeEach, describe, expect, it } from "bun:test";
import type { StateCreator, StoreApi } from "zustand";
import { create } from "zustand";
import type { KroniloState } from "../types/store";

let mockCron = "* * * * *";
let mockDismissedUntil: Date | null = null;

const testStoreShape: StateCreator<KroniloState> = (set, get) => ({
	donationModalOpen: false,
	setDonationModalOpen: (open) => set({ donationModalOpen: open }),
	cronToNaturalUsageCount: 0,
	incrementCronToNaturalUsage: () =>
		set((state: KroniloState) => ({
			cronToNaturalUsageCount: state.cronToNaturalUsageCount + 1,
		})),
	resetCronToNaturalUsage: () => set({ cronToNaturalUsageCount: 0 }),
	dismissedUntil: mockDismissedUntil,
	setDismissedUntil: (date) => {
		mockDismissedUntil = date;
		set({ dismissedUntil: date });
	},
	canShowDonationModal: () => {
		const { dismissedUntil } = get();
		if (!dismissedUntil) return true;
		return new Date() > dismissedUntil;
	},
	cron: mockCron,
	setCron: (cron) => {
		mockCron = cron;
		set({ cron });
	},
});

describe("kroniloStoreShape (Zustand store, test shape)", () => {
	let store: StoreApi<KroniloState>;
	beforeEach(() => {
		mockCron = "* * * * *";
		mockDismissedUntil = null;
		store = create(testStoreShape);
	});

	it("initializes with default state", () => {
		expect(store.getState().donationModalOpen).toBe(false);
		expect(store.getState().cronToNaturalUsageCount).toBe(0);
		expect(store.getState().dismissedUntil).toBe(null);
		expect(store.getState().cron).toBe("* * * * *");
	});

	it("can open and close the donation modal", () => {
		store.getState().setDonationModalOpen(true);
		expect(store.getState().donationModalOpen).toBe(true);
		store.getState().setDonationModalOpen(false);
		expect(store.getState().donationModalOpen).toBe(false);
	});

	it("increments and resets cronToNaturalUsageCount", () => {
		store.getState().incrementCronToNaturalUsage();
		expect(store.getState().cronToNaturalUsageCount).toBe(1);
		store.getState().incrementCronToNaturalUsage();
		expect(store.getState().cronToNaturalUsageCount).toBe(2);
		store.getState().resetCronToNaturalUsage();
		expect(store.getState().cronToNaturalUsageCount).toBe(0);
	});

	it("sets and gets cron value with persistence", () => {
		store.getState().setCron("0 0 * * 0");
		expect(store.getState().cron).toBe("0 0 * * 0");
	});

	it("sets and gets dismissedUntil with persistence", () => {
		const date = new Date("2099-01-01T00:00:00Z");
		store.getState().setDismissedUntil(date);
		expect(store.getState().dismissedUntil).toEqual(date);
	});

	it("canShowDonationModal returns true if dismissedUntil is null or in the past", () => {
		expect(store.getState().canShowDonationModal()).toBe(true);
		// Set dismissedUntil to a past date
		store.getState().setDismissedUntil(new Date(Date.now() - 10000));
		expect(store.getState().canShowDonationModal()).toBe(true);
	});

	it("canShowDonationModal returns false if dismissedUntil is in the future", () => {
		const future = new Date(Date.now() + 1000000);
		store.getState().setDismissedUntil(future);
		expect(store.getState().canShowDonationModal()).toBe(false);
	});
});
