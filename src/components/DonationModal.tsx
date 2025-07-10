import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface DonationModalProps {
	open: boolean;
	onClose: () => void;
	onMaybeLater: () => void;
}

export const DonationModal: FC<DonationModalProps> = ({
	open,
	onClose,
	onMaybeLater,
}) => {
	const modalRef = useRef<HTMLDivElement>(null);
	const firstFocusable = useRef<HTMLButtonElement | null>(null);
	const lastFocusable = useRef<HTMLButtonElement | null>(null);
	const [isPressed, setIsPressed] = useState(false);
	const [isCoffeePressed, setIsCoffeePressed] = useState(false);
	const [isMaybePressed, setIsMaybePressed] = useState(false);

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
			className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
			role="dialog"
			aria-modal="true"
			aria-label="Donation Modal"
			onClick={handleBackdropClick}
			onKeyDown={handleBackdropKeyDown}
		>
			<div className="bg-gray-50 text-gray-900 max-w-lg w-full mx-4 rounded-lg p-8 shadow-2xl border border-gray-200 relative max-h-[90vh] overflow-y-auto">
				<button
					type="button"
					className={`absolute right-3 top-3 text-gray-900 hover:text-black text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors z-10${
						isPressed ? " scale-95" : ""
					}`}
					aria-label="Close donation modal"
					onClick={onClose}
					onMouseDown={() => setIsPressed(true)}
					onMouseUp={() => setIsPressed(false)}
					onMouseLeave={() => setIsPressed(false)}
					onTouchStart={() => setIsPressed(true)}
					onTouchEnd={() => setIsPressed(false)}
					ref={firstFocusable}
				>
					✕
				</button>
				<div className="text-center">
					<p className="mb-6 text-gray-900 leading-relaxed">
						Kronilo is a free, open-source tool that respects your privacy—no
						ads, no trackers, no account.
						<br />
						<br />
						If it saved you time, please consider buying me a coffee. Every
						little bit helps keep Kronilo alive and ad-free.
					</p>

					<div className="flex justify-center mb-6">
						<a
							href="https://ko-fi.com/mooship"
							target="_blank"
							rel="noopener noreferrer"
							className={`btn bg-gray-900 hover:bg-black text-white btn-lg px-6 py-3 font-semibold flex items-center gap-2 rounded-full${
								isCoffeePressed ? " scale-95" : ""
							}`}
							aria-label="Support Kronilo on Ko-fi"
							onMouseDown={() => setIsCoffeePressed(true)}
							onMouseUp={() => setIsCoffeePressed(false)}
							onMouseLeave={() => setIsCoffeePressed(false)}
							onTouchStart={() => setIsCoffeePressed(true)}
							onTouchEnd={() => setIsCoffeePressed(false)}
						>
							☕ Buy me a coffee
						</a>
					</div>

					<div className="flex flex-col gap-2">
						<button
							type="button"
							onClick={onMaybeLater}
							className={`btn btn-ghost text-gray-900 hover:text-black rounded-full${isMaybePressed ? " scale-95" : ""}`}
							aria-label="Maybe later"
							onMouseDown={() => setIsMaybePressed(true)}
							onMouseUp={() => setIsMaybePressed(false)}
							onMouseLeave={() => setIsMaybePressed(false)}
							onTouchStart={() => setIsMaybePressed(true)}
							onTouchEnd={() => setIsMaybePressed(false)}
							ref={lastFocusable}
						>
							Maybe Later
						</button>
					</div>
				</div>
			</div>
		</div>,
		document.body,
	);
};
