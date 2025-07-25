import ky from "ky";
import { describe, expect, it, type MockInstance, vi } from "vitest";
import { apiRequest } from "../apiClient";

vi.mock("ky", () => ({
	default: vi.fn(),
}));

describe("apiRequest", () => {
	it("should return data and status on success", async () => {
		const mockJson = vi.fn().mockResolvedValue({ foo: "bar" });
		(ky as unknown as MockInstance).mockResolvedValue({
			status: 200,
			json: mockJson,
		});
		const result = await apiRequest<{ foo: string }>("/test");
		expect(result).toEqual({ data: { foo: "bar" }, status: 200 });
	});

	it("should handle TimeoutError", async () => {
		(ky as unknown as MockInstance).mockRejectedValue({
			name: "TimeoutError",
		});
		const result = await apiRequest("/timeout");
		expect(result.error).toBe("Request timeout. Please try again.");
		expect(result.status).toBe(408);
	});

	it("should handle network error", async () => {
		(ky as unknown as MockInstance).mockRejectedValue({
			message: "Network error",
		});
		const result = await apiRequest("/network");
		expect(result.error).toBe("Network error. Please check your connection.");
		expect(result.status).toBe(0);
	});

	it("should handle unknown error", async () => {
		(ky as unknown as MockInstance).mockRejectedValue({
			message: "Some unknown error",
		});
		const result = await apiRequest("/unknown");
		expect(result.error).toBe("Sorry, something went wrong. Please try again.");
	});
});
