import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOnClickOutside } from "usehooks-ts";
import { usePressAnimation } from "../../hooks/usePressAnimation";
import { LOCALES } from "../../locales";

const LanguageSwitcher: React.FC = () => {
	const { i18n } = useTranslation();
	const current = i18n.language;
	const [open, setOpen] = useState(false);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);
	const switcherBtnAnim = usePressAnimation();

	useOnClickOutside(menuRef as React.RefObject<HTMLElement>, (event) => {
		if (buttonRef.current?.contains(event.target as Node)) {
			return;
		}
		setOpen(false);
	});

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLButtonElement>) => {
			if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				setOpen((o) => !o);
			}
			if (e.key === "Escape") {
				setOpen(false);
			}
		},
		[],
	);

	const handleSelect = useCallback(
		(lang: string) => {
			i18n.changeLanguage(lang);
			try {
				window.localStorage.setItem("i18nextLng", lang);
			} catch {}
			setOpen(false);
		},
		[i18n],
	);

	const LANGUAGES = useMemo(
		() => LOCALES.map((l) => ({ code: l.code, label: l.name })),
		[],
	);
	const selected = useMemo(
		() => LANGUAGES.find((l) => l.code === current) || LANGUAGES[0],
		[LANGUAGES, current],
	);

	return (
		<div className="relative inline-block text-left" ref={menuRef}>
			<button
				ref={buttonRef}
				type="button"
				className={clsx(
					"flex items-center justify-between min-w-32 rounded-full border-2 px-2 sm:px-6 py-1 sm:py-2 text-sm sm:text-base bg-background text-foreground shadow-md focus:outline-none transition-all duration-200 cursor-pointer select-none",
					"border-blue-6 focus:ring-2 focus:ring-blue-6 hover:border-blue-6 hover:shadow-lg",
					{ "ring-2 ring-blue-6": open },
					switcherBtnAnim.isPressed && "scale-95",
				)}
				aria-haspopup="listbox"
				aria-expanded={open}
				aria-label="Switch language"
				tabIndex={0}
				onClick={() => setOpen((o) => !o)}
				onKeyDown={handleKeyDown}
				onMouseDown={switcherBtnAnim.handlePressStart}
				onMouseUp={switcherBtnAnim.handlePressEnd}
				onMouseLeave={switcherBtnAnim.handlePressEnd}
				onTouchStart={switcherBtnAnim.handlePressStart}
				onTouchEnd={switcherBtnAnim.handlePressEnd}
			>
				{/* Use a brighter green (green-6) to stand out on dark backgrounds */}
				<span className="font-semibold text-green-6">{selected.label}</span>
				<ChevronDown
					aria-hidden="true"
					className={clsx("ml-2 transition-transform duration-200", {
						"rotate-180": open,
					})}
				/>
			</button>
			{open && (
				<div
					className={clsx(
						"absolute z-50 mt-2 min-w-full rounded-2xl bg-background shadow-xl border-2 border-border overflow-hidden animate-fade-in",
					)}
				>
					{LANGUAGES.map((lang) => (
						<button
							key={lang.code}
							type="button"
							className={clsx(
								"w-full text-left px-2 sm:px-6 py-1 sm:py-2 text-sm sm:text-base transition-colors duration-150",
								"hover:bg-blue-6 hover:text-white focus:bg-blue-6 focus:text-white",
								{
									/* selected item: gentle green background and brighter -6 text */
									"bg-green-3 font-semibold text-green-6":
										current === lang.code,
								},
							)}
							onClick={() => handleSelect(lang.code)}
							tabIndex={0}
						>
							{lang.label}
						</button>
					))}
				</div>
			)}
		</div>
	);
};

export const MemoizedLanguageSwitcher = memo(LanguageSwitcher);
