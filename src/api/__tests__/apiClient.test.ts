import { beforeEach, describe, expect, it, vi } from "vitest";
import { __setApiFetcher, apiRequest } from "../apiClient";

describe("apiRequest", () => {
	const mockFetcher = Object.assign(vi.fn(), {
		raw: vi.fn(),
		native: vi.fn(),
		create: vi.fn(() => mockFetcher),
	});

	beforeEach(() => {
		mockFetcher.mockReset();
		__setApiFetcher(mockFetcher);
	});

	it("should return data and status on success", async () => {
		mockFetcher.mockResolvedValue({ foo: "bar" });
		const result = await apiRequest<{ foo: string }>("/test");
		expect(result).toEqual({ data: { foo: "bar" }, status: 200 });
		expect(mockFetcher).toHaveBeenCalledWith(
			"/test",
			expect.objectContaining({ responseType: "json" }),
		);
	});

	it("should handle TimeoutError", async () => {
		const error = { name: "TimeoutError" };
		mockFetcher.mockRejectedValue(error);
		const result = await apiRequest("/timeout");
		expect(result.error).toBe("Request timeout. Please try again.");
		expect(result.status).toBe(408);
	});

	it("should handle network error", async () => {
		const error = { message: "Network error" };
		mockFetcher.mockRejectedValue(error);
		const result = await apiRequest("/network");
		expect(result.error).toBe("Network error. Please check your connection.");
		expect(result.status).toBe(0);
	});

	it("should handle unknown error", async () => {
		const error = { message: "Some unknown error" };
		mockFetcher.mockRejectedValue(error);
		const result = await apiRequest("/unknown");
		expect(result.error).toBe("Sorry, something went wrong. Please try again.");
	});

	it("should use status from error if present", async () => {
		const error = { status: 418, message: "I'm a teapot" };
		mockFetcher.mockRejectedValue(error);
		const result = await apiRequest("/teapot");
		expect(result.status).toBe(418);
	});
});
