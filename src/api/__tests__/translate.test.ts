import type { MockInstance } from "vitest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as apiClient from "../apiClient";
import * as translate from "../translate";

vi.mock("../apiClient");

const mockApiRequest = apiClient.apiRequest as unknown as MockInstance;

describe("translate", () => {
	beforeEach(() => {
		mockApiRequest.mockReset();
	});

	it("should return error for empty input", async () => {
		const result = await translate.translateToCron("");
		expect(result.error).toMatch(/Input cannot be empty/);
		expect(result.status).toBe(400);
	});

	it("should return error if apiRequest returns error", async () => {
		mockApiRequest.mockResolvedValue({ error: "API error", status: 500 });
		const result = await translate.translateToCron("test");
		expect(result.error).toBe("API error");
		expect(result.status).toBe(500);
	});

	it("should handle rate limit error", async () => {
		mockApiRequest.mockResolvedValue({
			data: { error: "Rate limit exceeded", rateLimitType: "daily" },
			status: 429,
		});
		const result = await translate.translateToCron("test");
		expect(result.error).toBe("Rate limit exceeded");
		expect(result.status).toBe(429);
		expect(result.rateLimitType).toBe("daily");
	});

	it("should return data on success", async () => {
		mockApiRequest.mockResolvedValue({
			data: { cron: "* * * * *" },
			status: 200,
		});
		const result = await translate.translateToCron("test");
		expect(result.data).toEqual({ cron: "* * * * *" });
		expect(result.status).toBe(200);
	});

	it("should return error for unknown error", async () => {
		mockApiRequest.mockResolvedValue({});
		const result = await translate.translateToCron("test");
		expect(result.error).toBe("Unknown error.");
	});
});
