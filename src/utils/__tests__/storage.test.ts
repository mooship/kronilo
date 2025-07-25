import { beforeEach, describe, expect, it } from "vitest";
import { getItem, removeItem, setItem } from "../storage";

describe("storage", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it("should set and get an item", () => {
		setItem("foo", "bar");
		expect(getItem("foo")).toBe("bar");
	});

	it("should remove an item", () => {
		setItem("foo", "bar");
		removeItem("foo");
		expect(getItem("foo")).toBeNull();
	});

	it("should return null for non-existent key", () => {
		expect(getItem("doesNotExist")).toBeNull();
	});

	it("should handle localStorage errors gracefully", () => {
		const originalGetItem = localStorage.getItem;
		localStorage.getItem = () => {
			throw new Error("fail");
		};
		expect(getItem("foo")).toBeNull();
		localStorage.getItem = originalGetItem;
	});
});
