# Kronilo [![Node.js CI](https://github.com/mooship/kronilo/actions/workflows/node.js.yml/badge.svg)](https://github.com/mooship/kronilo/actions/workflows/node.js.yml) [![CodeQL](https://github.com/mooship/kronilo/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/mooship/kronilo/actions/workflows/github-code-scanning/codeql)

**Kronilo** is the fastest, most user-friendly way to translate, understand, and work with cron expressions. Built with React, TypeScript, and Vite, Kronilo is designed for developers, sysadmins, and anyone who needs to make sense of cron schedules—instantly.

---

## 🌍 Internationalization


Kronilo is fully localized and supports:

- English (`en`)
- French (`fr`)
- German (`de`)
- Spanish (`es`)
- Italian (`it`)
- Dutch (`nl`)
- Portuguese (Brazilian) (`pt-BR`)
- Portuguese (European) (`pt-PT`)
- Polish (`pl`)
- Swedish (`sv`)
- Danish (`da`)
- Norwegian Bokmål (`nb`)
- Finnish (`fi`)
- Ukrainian (`uk`)
- Romanian (`ro`)
- Turkish (`tr`)
- Esperanto (`eo`)

Kronilo automatically detects your browser language and allows you to switch languages on the fly.

We welcome new translations and improvements! If you'd like to contribute a new language or help improve existing translations, please open a pull request or issue. See the `public/locales` folder for translation files and instructions in the README.

---

## 🈳 Adding a New Translation

To add support for a new language, follow these steps:

1. **Add your translation file:**
   - Create a new folder for your language code in `public/locales/` (e.g., `public/locales/ja/` for Japanese).
   - Add a `translation.json` file with your translations.

2. **Centralize your language settings:**
   - Edit [`src/locales.ts`](src/locales.ts) and add your language code, display name, and (optionally) cronstrue locale mapping. This file is used by i18n, the language switcher, and cron translation logic.

3. **Update cronstrue locales (if supported):**
   - If your language is supported by [cronstrue](https://github.com/bradymholt/cronstrue), add a declaration to [`src/cronstrue-locales.d.ts`](src/cronstrue-locales.d.ts).

4. **Test your translation:**
   - Run the app locally and switch to your new language using the language switcher.
   - Check that cron translations and UI strings appear correctly.

5. **Open a pull request:**
   - Submit your changes for review. Include your translation file and all code updates.

**Note:** If your language is not supported by cronstrue, the cron expression translation will fall back to English, but UI strings will still be localized.

For questions or help, open an issue or ask in the repository discussions!
---

## ✨ Features

- **Natural Language ↔ Cron Translation:** Instantly convert between cron expressions and human-readable schedules, both directions.
- **Multi-language Cron Parsing:** See translations and next run times in your preferred language, including weekday/month names.
- **Upcoming Run Times:** View the next 5 execution dates for any cron schedule, formatted for your timezone and language.
- **Smart Error Handling:** Get clear, actionable feedback for invalid or ambiguous cron expressions.
- **Copy & Share:** One-click copy for cron expressions and translations—perfect for documentation or team chat.
- **Modern, Responsive UI:** Beautiful, accessible design with dark mode, keyboard navigation, and mobile support.
- **Privacy First:** No ads, no tracking, no accounts. Your data never leaves your browser except for translation API calls.
- **Open Source:** Licensed AGPL v3—contributions welcome!

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/T6T31HRCAR)

---

## 🖥️ Backend

Kronilo's natural language translation API is powered by [kronilo-worker](https://github.com/mooship/kronilo-worker), an open-source backend designed for privacy and speed. You can self-host or contribute to the backend as well.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v22 or newer recommended)
- npm (v11 or newer recommended)

### Install dependencies

```sh
npm install
```

### Run the development server

```sh
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```sh
npm run build
```

### Preview the production build

```sh
npm run preview
```

---

## 🧪 Testing

Kronilo includes comprehensive tests to ensure reliability and correctness:

```sh
# Run tests once
npm test

# Run tests in watch mode
npm run test:ui

# Run tests with coverage
npm run test:run
```

The test suite covers:
- **Cron validation:** Ensures accurate parsing and validation of cron expressions
- **Schedule calculation:** Tests next run time calculations and ambiguous schedule detection
- **Edge cases:** Comprehensive testing of malformed inputs, boundary conditions, and error handling

---

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
