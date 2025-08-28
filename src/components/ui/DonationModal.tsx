import clsx from "clsx";
import type { FC } from "react";
import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useUnmount } from "usehooks-ts";
import { usePressAnimation } from "../../hooks/usePressAnimation";
import type { DonationModalProps } from "../../types/components";

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

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
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
		},
		[onClose],
	);

	useEffect(() => {
		if (!open) {
			return;
		}
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [open, handleKeyDown]);

	useUnmount(() => {
		document.removeEventListener("keydown", handleKeyDown);
	});

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
			className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
			role="dialog"
			aria-modal="true"
			aria-label={t("donation.title", "Support Kronilo")}
			onClick={handleBackdropClick}
			onKeyDown={handleBackdropKeyDown}
		>
			<div
				className="relative px-4 max-h-[90vh] w-full max-w-2xl mx-auto overflow-y-auto rounded-xl border-2 bg-background p-8 text-foreground shadow-2xl animate-fade-in"
				style={{
					animation: "fadeInScale 0.5s cubic-bezier(0.4,0,0.2,1)",
					borderColor: "var(--color-border)",
				}}
			>
				<button
					type="button"
					className={`absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-foreground-tertiary text-xl transition-colors hover:bg-background-secondary hover:text-foreground${
						closeBtnAnim.isPressed ? " scale-95" : ""
					}`}
					aria-label={t("donation.close", "Close donation window")}
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
					<h2 className="mb-2 font-bold text-2xl text-foreground">
						{t("donation.title", "Support Kronilo")}
					</h2>
					<p className="mb-4 text-foreground leading-relaxed">
						{t(
							"donation.message",
							"Kronilo is a free, open-source tool that respects your privacy—no ads, no trackers, no account required.",
						)}
					</p>
					<p className="mb-6 text-foreground leading-relaxed">
						{t(
							"donation.messageExtended",
							"If it saved you time, please consider buying me a coffee. Every little bit helps keep Kronilo alive and ad-free.",
						)}
					</p>

					<div className="mb-6 flex justify-center">
						<a
							href="https://ko-fi.com/mooship"
							target="_blank"
							rel="noopener noreferrer"
							className={`btn btn-lg flex items-center gap-2 rounded-xl bg-blue-9 px-6 py-3 font-semibold text-white hover:bg-blue-10${
								coffeeBtnAnim.isPressed ? " scale-95" : ""
							}`}
							aria-label={t("donation.buyMeCoffee", "☕ Buy me a coffee")}
							onMouseDown={coffeeBtnAnim.handlePressStart}
							onMouseUp={coffeeBtnAnim.handlePressEnd}
							onMouseLeave={coffeeBtnAnim.handlePressEnd}
							onTouchStart={coffeeBtnAnim.handlePressStart}
							onTouchEnd={coffeeBtnAnim.handlePressEnd}
						>
							{t("donation.buyMeCoffee", "☕ Buy me a coffee")}
						</a>
					</div>

					<div className="flex flex-col gap-2">
						<button
							type="button"
							onClick={onMaybeLater}
							className={clsx(
								"btn btn-ghost rounded-xl text-foreground-secondary transition-colors duration-200",
								"hover:text-foreground focus:text-foreground",
								maybeBtnAnim.isPressed && "scale-95",
							)}
							style={{ background: "none" }}
							aria-label={t("donation.maybeLater", "Maybe later")}
							onMouseDown={maybeBtnAnim.handlePressStart}
							onMouseUp={maybeBtnAnim.handlePressEnd}
							onMouseLeave={maybeBtnAnim.handlePressEnd}
							onTouchStart={maybeBtnAnim.handlePressStart}
							onTouchEnd={maybeBtnAnim.handlePressEnd}
							ref={lastFocusable}
						>
							{t("donation.maybeLater", "Maybe later")}
						</button>
					</div>
				</div>
			</div>
		</div>,
		document.body,
	);
};
