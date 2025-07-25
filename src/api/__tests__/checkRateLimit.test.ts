import type { MockInstance } from "vitest";
import { describe, expect, it, vi } from "vitest";
import * as apiClient from "../apiClient";
import * as translate from "../translate";

vi.mock("../apiClient");

const mockApiRequest = apiClient.apiRequest as unknown as MockInstance;

function mockHealthResponse(
	data: Record<string, unknown> | undefined,
	error?: string,
	status = 200,
) {
	mockApiRequest.mockResolvedValue({ data, error, status });
}

describe("checkRateLimit", () => {
	it("should return not rate limited if no error and daily limit not reached", async () => {
		mockHealthResponse({
			status: "ok",
			rateLimit: { daily: { used: 1, limit: 10, remaining: 9 } },
		});
		const result = await translate.checkRateLimit();
		expect(result.rateLimited).toBe(false);
		expect(result.details).toMatch(/Daily usage: 1\/10/);
	});

	it("should return rate limited if daily limit reached", async () => {
		mockHealthResponse({
			status: "ok",
			rateLimit: { daily: { used: 10, limit: 10, remaining: 0 } },
		});
		const result = await translate.checkRateLimit();
		expect(result.rateLimited).toBe(true);
		expect(result.details).toMatch(/Daily limit reached/);
	});

	it("should handle missing rateLimit info", async () => {
		mockHealthResponse({ status: "ok" });
		const result = await translate.checkRateLimit();
		expect(result.rateLimited).toBe(false);
		expect(result.details).toBe("Rate limit information unavailable");
	});

	it("should handle service error status", async () => {
		mockHealthResponse({ status: "error", error: "Service error" });
		const result = await translate.checkRateLimit();
		expect(result.rateLimited).toBe(false);
		expect(result.details).toBe("Service error");
	});

	it("should handle error from apiRequest", async () => {
		mockApiRequest.mockResolvedValue({ error: "API error", status: 500 });
		const result = await translate.checkRateLimit();
		expect(result.rateLimited).toBe(false);
		expect(result.details).toBe("API error");
		expect(result.status).toBe(500);
	});

	it("should handle unknown error case", async () => {
		mockApiRequest.mockResolvedValue({ data: undefined, status: 200 });
		const result = await translate.checkRateLimit();
		expect(result.details).toBe("Unknown error.");
	});
});
