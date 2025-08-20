# Kronilo

**Kronilo** is the fastest, most user-friendly way to translate, understand, and work with cron expressions. Built with React, TypeScript, and Vite, Kronilo is designed for developers, sysadmins, and anyone who needs to make sense of cron schedules—instantly.

---

## 🌍 Internationalization


Kronilo is fully localized and supports:

 - Afrikaans (`af`)
 - Czech (`cs`)
 - Danish (`da`)
 - Dutch (`nl`)
 - English (`en`)
 - Finnish (`fi`)
 - French (`fr`)
 - German (`de`)
 - Italian (`it`)
 - Norwegian Bokmål (`nb`)
 - Polish (`pl`)
 - Portuguese (Brazilian) (`pt-BR`)
 - Portuguese (European) (`pt-PT`)
 - Romanian (`ro`)
 - Russian (`ru`)
 - Spanish (`es`)
 - Swedish (`sv`)
 - Turkish (`tr`)
 - Ukrainian (`uk`)

Kronilo automatically detects your browser language and allows you to switch languages on the fly.

We welcome new translations and improvements! If you'd like to contribute a new language or help improve existing translations, please open a pull request or issue. See the `public/locales` folder for translation files and instructions in the README.

---

## 🈳 Adding a New Translation

To add support for a new language, follow these steps:

1. **Add your translation file:**
   - Create a new folder for your language code in `public/locales/` (e.g., `public/locales/ja/` for Japanese).
   - Add a `translation.json` file with your translations.

2. **Centralize your language settings:**
   - Edit [`src/locales.ts`](src/locales.ts) and add your language code, display name, and (optionally) cronstrue locale mapping. **Please keep this list sorted alphabetically by display name.** This file is used by i18n, the language switcher, and cron translation logic.

3. **Update cronstrue locales (if supported):**
   - If your language is supported by [cronstrue](https://github.com/bradymholt/cronstrue), add a declaration to [`src/cronstrue-locales.d.ts`](src/cronstrue-locales.d.ts).
   - Add a static import for your cronstrue locale (e.g., `import "cronstrue/locales/xx";`) to [`src/components/CronTranslation.tsx`](src/components/CronTranslation.tsx). This ensures translations work correctly for your language.

4. **Test your translation:**
   - Run the app locally and switch to your new language using the language switcher.
   - Check that cron translations and UI strings appear correctly.

5. **Open a pull request:**
   - Submit your changes for review. Include your translation file and all code updates.

**Note:** If your language is not supported by cronstrue, the cron expression translation will fall back to English, but UI strings will still be localized.

For questions or help, open an issue or ask in the repository discussions!
---

## ✨ Features

- **Cron Translation:** Instantly convert cron expressions to human-readable schedules.
- **Multi-language Cron Parsing:** See translations and next run times in your preferred language, including weekday/month names.
- **Upcoming Run Times:** View the next 5 execution dates for any cron schedule, formatted for your timezone and language.
- **Smart Error Handling:** Get clear, actionable feedback for invalid or ambiguous cron expressions. Unknown or unsafe errors are always replaced with a safe fallback message.
- **Copy & Share:** One-click copy for cron expressions and translations—perfect for documentation or team chat.
- **Modern, Responsive UI:** Beautiful, accessible design with dark mode, keyboard navigation, and mobile support.
- **Privacy First:** No ads, no tracking, no accounts. Your data never leaves your browser.
- **Open Source:** Licensed AGPL v3—contributions welcome!

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/T6T31HRCAR)

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0 or newer recommended)

### Install dependencies

```sh
bun install
```

### Run the development server

```sh
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```sh
bun run build
```

### Preview the production build

```sh
bun run preview
```

---

## 🧪 Testing


Kronilo includes comprehensive tests to ensure reliability and correctness:

```sh
# Run tests once
bun test

# Run tests in watch mode
bun run test:ui

## 🛠️ Code Quality

Kronilo uses [Biome](https://biomejs.dev/) for formatting and linting. To check code quality:

```sh
npm run biome
```

Or run Biome directly:

```sh
biome ci .
```

---

## 📄 License

Kronilo is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See the [LICENSE](LICENSE) file for details.

---
