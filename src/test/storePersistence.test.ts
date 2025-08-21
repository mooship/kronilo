// Tests for mocked persistence helpers.
// Simulates `localStorage` using an in-memory object so persistence helpers
// can be validated deterministically in unit tests without a browser.
import { beforeEach, describe, expect, it } from "bun:test";
import { isValidCronFormat } from "../utils/cronValidation";

// In-memory mock storage used by the helper functions below.
let storage: Record<string, string> = {};
const getItem = (key: string) => storage[key] ?? null;
const setItem = (key: string, value: string) => {
	storage[key] = value;
};
const removeItem = (key: string) => {
	delete storage[key];
};

// Helper wrappers that mirror the real app's persistence helpers.
// They convert to/from ISO strings for dates and validate cron
// strings before persisting.
const getStoredDismissedUntil = (): Date | null => {
	const stored = getItem("kronilo-dismissed-until");
	return stored ? new Date(stored) : null;
};
const setStoredDismissedUntil = (date: Date | null): void => {
	if (date) {
		setItem("kronilo-dismissed-until", date.toISOString());
	} else {
		removeItem("kronilo-dismissed-until");
	}
};
const getStoredCron = (): string => {
	const stored = getItem("kronilo-cron");
	return stored ?? "*/5 * * * *";
};
const setStoredCron = (cron: string): void => {
	if (isValidCronFormat(cron)) {
		setItem("kronilo-cron", cron);
	} else {
		removeItem("kronilo-cron");
	}
};

describe("storePersistence (mocked storage)", () => {
	beforeEach(() => {
		storage = {};
	});

	describe("getStoredDismissedUntil / setStoredDismissedUntil", () => {
		it("returns null if not set", () => {
			expect(getStoredDismissedUntil()).toBe(null);
		});
		it("sets and gets a dismissed-until date", () => {
			const date = new Date("2099-01-01T00:00:00Z");
			setStoredDismissedUntil(date);
			expect(getStoredDismissedUntil()?.toISOString()).toBe(date.toISOString());
		});
		it("removes the dismissed-until date", () => {
			setStoredDismissedUntil(new Date());
			setStoredDismissedUntil(null);
			expect(getStoredDismissedUntil()).toBe(null);
		});
	});

	describe("getStoredCron / setStoredCron", () => {
		it("returns default if not set", () => {
			expect(getStoredCron()).toBe("*/5 * * * *");
		});
		it("sets and gets a valid cron", () => {
			setStoredCron("0 0 * * 0");
			expect(getStoredCron()).toBe("0 0 * * 0");
		});
		it("removes the cron if invalid", () => {
			setStoredCron("invalid cron");
			expect(getStoredCron()).toBe("*/5 * * * *");
		});
	});
});
