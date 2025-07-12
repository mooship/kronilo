# Kronilo [![Node.js CI](https://github.com/mooship/kronilo/actions/workflows/node.js.yml/badge.svg)](https://github.com/mooship/kronilo/actions/workflows/node.js.yml) [![CodeQL](https://github.com/mooship/kronilo/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/mooship/kronilo/actions/workflows/github-code-scanning/codeql)

Kronilo is a minimal, modern web app for translating and understanding cron expressions. Built with React, TypeScript, and Vite, it provides a fast, intuitive interface for working with cron schedules. The project includes code quality checks using Biome and is styled with Tailwind CSS.

Kronilo is not limited to English—we support a wide variety of natural languages. Our app has strong support for:

- English
- German
- Spanish
- French
- Italian
- Dutch
- Swedish
- Norwegian
- Danish
- Indonesian
- Turkish

This makes Kronilo accessible to users across many regions and languages.

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/T6T31HRCAR)

---

## Features

- Translate cron expressions into human-readable text
- See upcoming run times for a given cron schedule
- Copy cron expressions easily
- Clean, responsive UI

## Getting Started

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

The app will be available at `http://localhost:5173` by default.

### Build for production

```sh
npm run build
```

### Preview the production build

```sh
npm run preview
```

## Code Quality

This project uses [Biome](https://biomejs.dev/) for code formatting and linting. To check code quality:

```sh
npm run biome
```

Or run Biome directly:

```sh
biome ci .
```

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See the [LICENSE](LICENSE) file for details.

---
