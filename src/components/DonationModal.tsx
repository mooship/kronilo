import type { FC } from "react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { usePressAnimation } from "../hooks/usePressAnimation";
import type { DonationModalProps } from "../types/components";

/**
 * Modal component for encouraging user donations.
 * Features accessibility support with focus management, keyboard navigation,
 * and proper ARIA attributes. Rendered using React Portal for proper z-index handling.
 *
 * @param open - Whether the modal should be visible
 * @param onClose - Callback function when the modal is closed
 * @param onMaybeLater - Callback function when user selects "Maybe Later" option
 *
 * @example
 * ```tsx
 * <DonationModal
 *   open={showModal}
 *   onClose={() => setShowModal(false)}
 *   onMaybeLater={() => postponeDonationModal()}
 * />
 * ```
 */
export const DonationModal: FC<DonationModalProps> = ({
	open,
	onClose,
	onMaybeLater,
}) => {
	const { t } = useTranslation();
	const modalRef = useRef<HTMLDivElement>(null);
	const firstFocusable = useRef<HTMLButtonElement | null>(null);
	const lastFocusable = useRef<HTMLButtonElement | null>(null);
	const closeBtnAnim = usePressAnimation();
	const coffeeBtnAnim = usePressAnimation();
	const maybeBtnAnim = usePressAnimation();

	useEffect(() => {
		if (!open) {
			return;
		}
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") {
				onClose();
			}
			if (e.key === "Tab") {
				const focusableEls = [
					firstFocusable.current,
					lastFocusable.current,
				].filter(Boolean) as HTMLElement[];
				if (focusableEls.length === 0) {
					return;
				}
				const [first, last] = focusableEls;
				if (e.shiftKey) {
					if (document.activeElement === first) {
						e.preventDefault();
						last.focus();
					}
				} else {
					if (document.activeElement === last) {
						e.preventDefault();
						first.focus();
					}
				}
			}
		}
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [open, onClose]);

	function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
		if (e.target === modalRef.current) {
			onClose();
		}
	}

	useEffect(() => {
		if (open && firstFocusable.current) {
			firstFocusable.current.focus();
		}
	}, [open]);

	if (!open) {
		return null;
	}

	function handleBackdropKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
		if (e.key === "Escape") {
			onClose();
		}
	}

	return createPortal(
		<div
			ref={modalRef}
			className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 dark:bg-black/70"
			role="dialog"
			aria-modal="true"
			aria-label={t("donation.title")}
			onClick={handleBackdropClick}
			onKeyDown={handleBackdropKeyDown}
		>
			<div
				className="relative mx-4 max-h-[90vh] w-full max-w-2xl mx-auto overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-8 text-gray-900 shadow-2xl dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-50 animate-fade-in"
				style={{ animation: "fadeInScale 0.5s cubic-bezier(0.4,0,0.2,1)" }}
			>
				<button
					type="button"
					className={`absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-gray-900 text-xl transition-colors hover:bg-gray-100 hover:text-black dark:text-neutral-50 dark:hover:text-gray-300 dark:hover:bg-neutral-700${
						closeBtnAnim.isPressed ? " scale-95" : ""
					}`}
					aria-label={t("donation.close")}
					onClick={onClose}
					onMouseDown={closeBtnAnim.handlePressStart}
					onMouseUp={closeBtnAnim.handlePressEnd}
					onMouseLeave={closeBtnAnim.handlePressEnd}
					onTouchStart={closeBtnAnim.handlePressStart}
					onTouchEnd={closeBtnAnim.handlePressEnd}
					ref={firstFocusable}
				>
					✕
				</button>
				<div className="text-center">
					<h2 className="mb-2 font-bold text-2xl text-gray-900 dark:text-neutral-50">
						{t("donation.title")}
					</h2>
					<p className="mb-4 text-gray-900 leading-relaxed dark:text-neutral-50">
						{t("donation.message")}
					</p>
					<p className="mb-6 text-gray-900 leading-relaxed dark:text-neutral-50">
						{t("donation.messageExtended")}
					</p>

					<div className="mb-6 flex justify-center">
						<a
							href="https://ko-fi.com/mooship"
							target="_blank"
							rel="noopener noreferrer"
							className={`btn btn-lg flex items-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 font-semibold text-neutral-50 hover:bg-neutral-800 dark:bg-gray-100 dark:text-black dark:hover:bg-gray-200${
								coffeeBtnAnim.isPressed ? " scale-95" : ""
							}`}
							aria-label={t("donation.buyMeCoffee")}
							onMouseDown={coffeeBtnAnim.handlePressStart}
							onMouseUp={coffeeBtnAnim.handlePressEnd}
							onMouseLeave={coffeeBtnAnim.handlePressEnd}
							onTouchStart={coffeeBtnAnim.handlePressStart}
							onTouchEnd={coffeeBtnAnim.handlePressEnd}
						>
							{t("donation.buyMeCoffee")}
						</a>
					</div>

					<div className="flex flex-col gap-2">
						<button
							type="button"
							onClick={onMaybeLater}
							className={`btn btn-ghost rounded-xl text-gray-900 hover:text-black dark:text-neutral-50 dark:hover:text-gray-300 dark:hover:bg-neutral-700${maybeBtnAnim.isPressed ? " scale-95" : ""}`}
							aria-label={t("donation.maybeLater")}
							onMouseDown={maybeBtnAnim.handlePressStart}
							onMouseUp={maybeBtnAnim.handlePressEnd}
							onMouseLeave={maybeBtnAnim.handlePressEnd}
							onTouchStart={maybeBtnAnim.handlePressStart}
							onTouchEnd={maybeBtnAnim.handlePressEnd}
							ref={lastFocusable}
						>
							{t("donation.maybeLater")}
						</button>
					</div>
				</div>
			</div>
		</div>,
		document.body,
	);
};
