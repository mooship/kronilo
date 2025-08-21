/**
 * Unit tests for storage utility functions.
 *
 * These tests verify that the safe localStorage wrapper functions handle various error cases
 * and provide consistent behavior when localStorage is unavailable. Uses mocked localStorage
 * to simulate different scenarios and edge cases.
 */
import { beforeEach, describe, expect, it, mock } from "bun:test";
import { getItem, removeItem, setItem } from "../utils/storage";

// Mock localStorage to simulate browser storage in a controlled way
const createMockStorage = () => {
	const storage: Record<string, string> = {};
	return {
		getItem: mock((key: string) => storage[key] ?? null),
		setItem: mock((key: string, value: string) => {
			storage[key] = value;
		}),
		removeItem: mock((key: string) => {
			delete storage[key];
		}),
		clear: () => {
			for (const key in storage) {
				delete storage[key];
			}
		},
		get _internal() {
			return storage;
		},
	};
};

describe("storage utilities", () => {
	let mockLocalStorage: ReturnType<typeof createMockStorage>;

	beforeEach(() => {
		mockLocalStorage = createMockStorage();
		// @ts-expect-error Mock localStorage
		global.localStorage = mockLocalStorage;
	});

	describe("getItem", () => {
		it("returns value from localStorage", () => {
			mockLocalStorage.setItem("testKey", "test-value");
			expect(getItem("testKey")).toBe("test-value");
			expect(mockLocalStorage.getItem).toHaveBeenCalledWith("testKey");
		});

		it("returns null for non-existent keys", () => {
			expect(getItem("non-existent")).toBe(null);
		});

		it("returns null when localStorage throws", () => {
			mockLocalStorage.getItem.mockImplementation(() => {
				throw new Error("Storage access denied");
			});

			expect(getItem("testKey")).toBe(null);
		});

		it("handles empty string values", () => {
			mockLocalStorage.setItem("empty", "");
			expect(getItem("empty")).toBe("");
		});
	});

	describe("setItem", () => {
		it("stores value in localStorage", () => {
			setItem("testKey", "test-value");
			expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
				"testKey",
				"test-value",
			);
			expect(mockLocalStorage._internal.testKey).toBe("test-value");
		});

		it("silently ignores localStorage errors", () => {
			mockLocalStorage.setItem.mockImplementation(() => {
				throw new Error("Storage quota exceeded");
			});

			// Should not throw
			expect(() => setItem("testKey", "test-value")).not.toThrow();
		});

		it("handles empty string values", () => {
			setItem("empty", "");
			expect(mockLocalStorage.setItem).toHaveBeenCalledWith("empty", "");
		});

		it("handles large values", () => {
			const largeValue = "x".repeat(10000);
			setItem("large", largeValue);
			expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
				"large",
				largeValue,
			);
		});

		it("handles special characters", () => {
			const specialValue = "🚀 test with émojis & spëcial chars";
			setItem("special", specialValue);
			expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
				"special",
				specialValue,
			);
		});
	});

	describe("removeItem", () => {
		it("removes value from localStorage", () => {
			mockLocalStorage.setItem("testKey", "test-value");
			removeItem("testKey");
			expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("testKey");
			expect(mockLocalStorage._internal.testKey).toBeUndefined();
		});

		it("silently ignores localStorage errors", () => {
			mockLocalStorage.removeItem.mockImplementation(() => {
				throw new Error("Storage access denied");
			});

			// Should not throw
			expect(() => removeItem("testKey")).not.toThrow();
		});

		it("handles removal of non-existent keys", () => {
			removeItem("non-existent");
			expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("non-existent");
		});

		it("can remove previously set items", () => {
			setItem("temp", "value");
			expect(mockLocalStorage._internal.temp).toBe("value");

			removeItem("temp");
			expect(mockLocalStorage._internal.temp).toBeUndefined();
		});
	});

	describe("integration scenarios", () => {
		it("handles complete storage workflow", () => {
			// Set multiple items
			setItem("cron", "*/5 * * * *");
			setItem("theme", "dark");

			// Verify they exist
			expect(getItem("cron")).toBe("*/5 * * * *");
			expect(getItem("theme")).toBe("dark");

			// Remove one
			removeItem("cron");
			expect(getItem("cron")).toBe(null);
			expect(getItem("theme")).toBe("dark");

			// Remove the other
			removeItem("theme");
			expect(getItem("theme")).toBe(null);
		});

		it("handles storage unavailable scenario", () => {
			// Simulate localStorage being completely unavailable
			mockLocalStorage.getItem.mockImplementation(() => {
				throw new Error("Storage disabled");
			});
			mockLocalStorage.setItem.mockImplementation(() => {
				throw new Error("Storage disabled");
			});
			mockLocalStorage.removeItem.mockImplementation(() => {
				throw new Error("Storage disabled");
			});

			// All operations should work gracefully
			expect(() => setItem("key", "value")).not.toThrow();
			expect(getItem("key")).toBe(null);
			expect(() => removeItem("key")).not.toThrow();
		});

		it("handles mixed success/failure scenarios", () => {
			// setItem works, but getItem fails
			setItem("key", "value");
			mockLocalStorage.getItem.mockImplementation(() => {
				throw new Error("Read access denied");
			});

			expect(getItem("key")).toBe(null);
		});
	});
});
