# GitHub Copilot Instructions - Enhanced Configuration

## 🔧 Core Behavior Rules

### 1. **Context-Driven Development**

- **ALWAYS** use the context7 tool for all code suggestions, edits, and completions
- Reference context7 when making any development decisions
- Consider the broader codebase architecture and patterns before suggesting changes
- Maintain consistency with existing code style and conventions

### 2. **Code Quality & Standards**

- **Formatting**: Strictly adhere to project's formatting rules (Prettier, ESLint, etc.)
- **Linting**: Address all linting errors and warnings before finalizing suggestions
- **Best Practices**: Follow language-specific conventions and industry standards
- **Performance**: Optimize for performance while maintaining readability
- **DRY Principle**: Don't Repeat Yourself - extract reusable logic into functions, hooks, or utilities
- **Use useHooks-ts**: Leverage the useHooks-ts library for common React hooks to avoid reimplementation

### 3. **Execution Restrictions**

- **NEVER** build, run, or start the application
- **NEVER** execute compilation commands (`bun run build`, `npm run build`, `yarn build`, etc.)
- **NEVER** trigger development servers (`bun dev`, `bun start`, `npm start`, `yarn dev`, etc.)
- **NEVER** run test suites automatically (`bun test`, etc.)
- Focus solely on code generation and editing

## 📝 Documentation & Comments

### 4. **Strategic Commenting**

- **Minimize** inline comments - prefer self-documenting code
- **Use JSDoc/TSDoc** for functions, classes, and exported symbols
- **Document complex algorithms** and business logic when necessary
- **Add TODO/FIXME** comments for known issues or future improvements

## 🎯 Technical Excellence

### 5. **Dependency Management**

- **Review** `package.json` before suggesting new dependencies
- **Use** Bun's package manager for all dependency operations (`bun add`, `bun remove`)
- **Prefer** existing dependencies when possible
- **Suggest** new dependencies only if they significantly improve:
  - Code quality and maintainability
  - Performance and bundle size
  - Developer experience
  - Accessibility compliance
- **Avoid** dependencies with security vulnerabilities or poor maintenance
- **Consider** Bun's built-in APIs and optimizations before adding external packages

### 6. **Accessibility First**

- **Semantic HTML**: Use proper HTML elements (`<button>`, `<nav>`, `<main>`, etc.)
- **ARIA Attributes**: Implement when semantic HTML isn't sufficient
- **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
- **Screen Reader Support**: Test with assistive technologies in mind
- **Color Contrast**: Follow WCAG guidelines using Tailwind's contrast utilities
- **Focus Management**: Use Tailwind's focus utilities (`focus:ring`, `focus:outline`) for proper focus states
- **Responsive Design**: Implement mobile-first approach with Tailwind's responsive prefixes

### 7. **Security & Privacy**

- **NEVER** expose API keys, secrets, or credentials
- **NEVER** hardcode sensitive configuration values
- **Use** environment variables for configuration
- **Sanitize** user inputs and validate data
- **Follow** OWASP security guidelines
- **Implement** proper authentication and authorization patterns

### 8. **Error Handling & Resilience**

- **Implement** comprehensive error boundaries (React)
- **Use** proper try-catch blocks for async operations
- **Validate** inputs at function boundaries
- **Provide** meaningful error messages for users
- **Log** errors appropriately for debugging
- **Handle** edge cases and null/undefined values

## 🚀 Advanced Features

### 9. **Performance Optimization**

- **Lazy Loading**: Implement for routes, components, and assets
- **Memoization**: Use React.memo, useMemo, useCallback appropriately
- **Bundle Optimization**: Consider code splitting and tree shaking
- **Database**: Optimize queries and implement proper indexing
- **Caching**: Implement appropriate caching strategies

### 10. **Testing Considerations**

- **Testable Code**: Write code that's easy to unit test
- **Pure Functions**: Prefer pure functions when possible
- **Dependency Injection**: Make dependencies explicit and mockable
- **Data-testid**: Add test identifiers for UI testing when appropriate

### 11. **User Experience**

- **Loading States**: Implement with Tailwind animations (`animate-pulse`, `animate-spin`)
- **Error States**: Provide clear error feedback with appropriate Tailwind styling
- **Empty States**: Handle cases with no data gracefully using Tailwind layouts
- **Responsive Design**: Use Tailwind's mobile-first responsive system
- **Progressive Enhancement**: Build with graceful degradation using Tailwind utilities
- **Interactive States**: Leverage Tailwind's hover, focus, and active state modifiers

## ⚡ Workflow Rules

### 12. **Change Management**

- **Confirm** before making large-scale refactoring changes
- **Break down** large changes into smaller, reviewable chunks
- **Explain** the reasoning behind significant architectural decisions
- **Preserve** existing functionality unless explicitly asked to change it

### 13. **Code Review Mindset**

- **Suggest** improvements for code readability and maintainability
- **Flag** potential security vulnerabilities
- **Identify** performance bottlenecks
- **Recommend** better patterns when applicable

### 14. **Documentation Integration**

- **Update** README.md when adding new features
- **Maintain** API documentation
- **Document** environment setup requirements
- **Keep** changelog updated for significant changes

## 🎨 Language-Specific Guidelines

### Bun Runtime

- Leverage Bun's built-in APIs (File I/O, HTTP server, etc.) over external packages
- Use Bun's native TypeScript support without additional transpilation
- Take advantage of Bun's fast bundling and hot reloading capabilities
- Consider Bun's compatibility with Node.js APIs while preferring Bun-native solutions

### TypeScript/JavaScript

- Prefer `const` over `let`, avoid `var`
- Use proper typing in TypeScript
- Implement proper async/await patterns
- Follow functional programming principles when appropriate
- Leverage Bun's built-in test runner for testing patterns

### React

- Use functional components over class components
- Implement proper hooks usage patterns
- Follow React best practices for state management
- Optimize re-renders with proper dependencies
- **Use useHooks-ts** for common functionality (useLocalStorage, useDebounce, useToggle, etc.)
- **Extract custom hooks** for reusable stateful logic following DRY principles

### CSS/Tailwind

- **Use Tailwind CSS** utility classes for all styling
- **Use CLSX** for conditional class composition and dynamic styling
- **Prefer** Tailwind utilities over custom CSS when possible
- **Follow** Tailwind's responsive design patterns (`sm:`, `md:`, `lg:`, etc.)
- **Use** Tailwind's design tokens for consistency (spacing, colors, typography)
- **Optimize** class ordering for better readability (layout → spacing → styling)
- **Leverage** Tailwind's built-in accessibility features and focus states
