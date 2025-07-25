import clsx from "clsx";
import { memo, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LOCALES } from "../locales";

const LanguageSwitcher: React.FC = () => {
	const { i18n } = useTranslation();
	const current = i18n.language;
	const [open, setOpen] = useState(false);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target as Node)
			) {
				setOpen(false);
			}
		}
		if (open) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [open]);

	function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
		if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			setOpen((o) => !o);
		}
		if (e.key === "Escape") {
			setOpen(false);
		}
	}

	function handleSelect(lang: string) {
		i18n.changeLanguage(lang);
		try {
			window.localStorage.setItem("i18nextLng", lang);
		} catch {}
		setOpen(false);
	}

	const LANGUAGES = LOCALES.map((l) => ({ code: l.code, label: l.name }));
	const selected = LANGUAGES.find((l) => l.code === current) || LANGUAGES[0];

	return (
		<div className="relative inline-block text-left" ref={menuRef}>
			<button
				ref={buttonRef}
				type="button"
				className={clsx(
					"flex items-center justify-between w-40 sm:w-56 md:w-64 rounded-full border-2 px-4 sm:px-6 px-2 py-2 sm:py-2 py-1 text-base sm:text-base text-sm bg-white dark:bg-neutral-800 dark:text-neutral-50 shadow-md focus:outline-none transition-all duration-200 cursor-pointer select-none",
					"border-violet-400 dark:border-violet-500 focus:ring-2 focus:ring-violet-400 dark:focus:ring-violet-500 hover:border-violet-500 hover:shadow-lg",
					{ "ring-2 ring-violet-400 dark:ring-violet-500": open },
				)}
				aria-haspopup="listbox"
				aria-expanded={open}
				aria-label="Switch language"
				tabIndex={0}
				onClick={() => setOpen((o) => !o)}
				onKeyDown={handleKeyDown}
			>
				<span className="font-semibold text-emerald-700 dark:text-emerald-400">
					{selected.label}
				</span>
				<svg
					width="20"
					height="20"
					fill="none"
					viewBox="0 0 24 24"
					aria-hidden="true"
					className={clsx("ml-2 transition-transform duration-200", {
						"rotate-180": open,
					})}
				>
					<title>Open language dropdown</title>
					<path
						d="M7 10l5 5 5-5"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>
			{open && (
				<div
					className={clsx(
						"absolute z-50 mt-2 w-40 sm:w-56 md:w-64 rounded-2xl bg-white dark:bg-neutral-800 shadow-xl border-2 border-violet-200 dark:border-violet-700 overflow-hidden animate-fade-in",
					)}
				>
					{LANGUAGES.map((lang) => (
						<button
							key={lang.code}
							type="button"
							className={clsx(
								"w-full text-left px-4 sm:px-6 px-2 py-2 sm:py-2 py-1 text-base sm:text-base text-sm transition-colors duration-150 hover:bg-violet-100 dark:hover:bg-violet-900 focus:bg-violet-100 dark:focus:bg-violet-900",
								{
									"bg-emerald-100 dark:bg-emerald-900 font-semibold text-emerald-700 dark:text-emerald-300":
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
