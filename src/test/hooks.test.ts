/**
 * Unit tests for custom React hooks used throughout the application.
 *
 * These tests verify hook logic and state transitions in isolation using React Testing Library.
 * All tests avoid external systems to remain fast, deterministic, and focused on hook behavior.
 */
import { beforeEach, describe, expect, it, mock } from "bun:test";
import { act, renderHook } from "@testing-library/react";
import "./setup"; // Import DOM setup
import { useCronValidation } from "../hooks/useCronValidation";
import { useDonationModal } from "../hooks/useDonationModal";
import { usePressAnimation } from "../hooks/usePressAnimation";
import type { KroniloState } from "../types/store";

let mockStore: KroniloState;

const createMockStore = (): KroniloState => ({
	donationModalOpen: false,
	setDonationModalOpen: mock(() => {}),
	cronToNaturalUsageCount: 0,
	incrementCronToNaturalUsage: mock(() => {}),
	resetCronToNaturalUsage: mock(() => {}),
	dismissedUntil: null,
	setDismissedUntil: mock((_date: Date | null) => {}),
	canShowDonationModal: mock(() => true),
	cron: "",
	setCron: mock(() => {}),
});

mock.module("usehooks-ts", () => ({
	useDebounceValue: mock((value: string) => [value]),
	useCopyToClipboard: mock(() => [null, mock(() => {})]),
	useTimeout: mock(() => {}),
}));

describe("usePressAnimation", () => {
	it("initializes with isPressed false (default state)", () => {
		const { result } = renderHook(() => usePressAnimation());
		expect(result.current.isPressed).toBe(false);
	});

	it("sets isPressed to true when handlePressStart is called", () => {
		const { result } = renderHook(() => usePressAnimation());
		act(() => {
			result.current.handlePressStart();
		});
		expect(result.current.isPressed).toBe(true);
	});

	it("sets isPressed to false when handlePressEnd is called", () => {
		const { result } = renderHook(() => usePressAnimation());
		act(() => {
			result.current.handlePressStart();
		});
		expect(result.current.isPressed).toBe(true);
		act(() => {
			result.current.handlePressEnd();
		});
		expect(result.current.isPressed).toBe(false);
	});

	it("can toggle press state multiple times (robustness)", () => {
		const { result } = renderHook(() => usePressAnimation());
		for (let i = 0; i < 3; i++) {
			act(() => {
				result.current.handlePressStart();
			});
			expect(result.current.isPressed).toBe(true);
			act(() => {
				result.current.handlePressEnd();
			});
			expect(result.current.isPressed).toBe(false);
		}
	});
});

describe("useCronValidation", () => {
	it("returns no error for valid cron expressions", () => {
		const { result } = renderHook(() => useCronValidation("* * * * *"));
		expect(result.current.error).toBeUndefined();
	});

	it("returns no error for empty string", () => {
		const { result } = renderHook(() => useCronValidation(""));
		expect(result.current.error).toBeUndefined();
	});

	it("provides clearError function", () => {
		const { result } = renderHook(() => useCronValidation("* * * * *"));
		expect(typeof result.current.clearError).toBe("function");
	});

	it("clearError function can be called without errors", () => {
		const { result } = renderHook(() => useCronValidation("* * * * *"));

		act(() => {
			result.current.clearError();
		});

		expect(result.current.error).toBeUndefined();
	});
});

describe("useDonationModal", () => {
	beforeEach(() => {
		mockStore = createMockStore();
		mock.module("../hooks/useKroniloStore", () => ({
			useKroniloStore: mock((selector: (state: KroniloState) => unknown) =>
				selector(mockStore),
			),
		}));
	});

	it("returns initial donation modal state", () => {
		const { result } = renderHook(() => useDonationModal());
		expect(result.current.donationModalOpen).toBe(false);
	});

	it("provides handler functions", () => {
		const { result } = renderHook(() => useDonationModal());

		expect(typeof result.current.handleFooterDonateClick).toBe("function");
		expect(typeof result.current.handleCloseModal).toBe("function");
		expect(typeof result.current.handleMaybeLater).toBe("function");
	});

	it("handleFooterDonateClick prevents default and opens modal", () => {
		const { result } = renderHook(() => useDonationModal());
		const mockEvent = {
			preventDefault: mock(() => {}),
		} as unknown as React.MouseEvent;

		act(() => {
			result.current.handleFooterDonateClick(mockEvent);
		});

		expect(mockEvent.preventDefault).toHaveBeenCalled();
		expect(mockStore.setDonationModalOpen).toHaveBeenCalledWith(true);
	});

	it("handleCloseModal closes modal and resets usage", () => {
		const { result } = renderHook(() => useDonationModal());

		act(() => {
			result.current.handleCloseModal();
		});

		expect(mockStore.setDonationModalOpen).toHaveBeenCalledWith(false);
		expect(mockStore.resetCronToNaturalUsage).toHaveBeenCalled();
	});

	it("handleMaybeLater dismisses modal for 14 days", () => {
		const { result } = renderHook(() => useDonationModal());
		const beforeDate = new Date();

		act(() => {
			result.current.handleMaybeLater();
		});

		expect(mockStore.setDonationModalOpen).toHaveBeenCalledWith(false);
		expect(mockStore.resetCronToNaturalUsage).toHaveBeenCalled();
		expect(mockStore.setDismissedUntil).toHaveBeenCalled();

		// Verify the date is approximately 14 days from now
		const setDismissedUntilMock = mockStore.setDismissedUntil as unknown as {
			mock: { calls: unknown[][] };
		};
		const dismissedDate = setDismissedUntilMock.mock.calls[0]?.[0] as Date;
		if (dismissedDate) {
			const diffInDays = Math.floor(
				(dismissedDate.getTime() - beforeDate.getTime()) /
					(1000 * 60 * 60 * 24),
			);
			expect(diffInDays).toBe(14);
		}
	});

	it("opens modal when usage count reaches 5 and modal can be shown", () => {
		mockStore.cronToNaturalUsageCount = 5;
		(
			mockStore.canShowDonationModal as unknown as {
				mockReturnValue: (v: boolean) => void;
			}
		).mockReturnValue(true);

		renderHook(() => useDonationModal());

		expect(mockStore.setDonationModalOpen).toHaveBeenCalledWith(true);
		expect(mockStore.resetCronToNaturalUsage).toHaveBeenCalled();
	});

	it("does not open modal when usage count is 5 but modal cannot be shown", () => {
		mockStore.cronToNaturalUsageCount = 5;
		(
			mockStore.canShowDonationModal as unknown as {
				mockReturnValue: (v: boolean) => void;
			}
		).mockReturnValue(false);

		renderHook(() => useDonationModal());

		expect(mockStore.setDonationModalOpen).not.toHaveBeenCalled();
	});

	it("does not open modal when usage count is less than 5", () => {
		mockStore.cronToNaturalUsageCount = 3;

		renderHook(() => useDonationModal());

		expect(mockStore.setDonationModalOpen).not.toHaveBeenCalled();
	});
});
