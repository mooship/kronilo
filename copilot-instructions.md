## Copilot Instructions

1. **Context Usage**: Copilot must use context7 for all code suggestions, edits, and completions. Always reference context7 when making decisions or generating code.

2. **Formatting & Linting**: Copilot must be mindful of formatting and linting errors and warnings. All code suggestions and edits should follow the project's formatting and linting rules. If errors or warnings are detected, Copilot should address them before finalizing any changes.

3. **Build/Run Restrictions**: Copilot must never build or run the app. Do not execute build, run, or start commands, and do not trigger any process that compiles or launches the application.

4. **Code Comments**: Avoid most comments in code. However, use XML summary comments for C# and JSDoc comments for JavaScript/TypeScript where appropriate (e.g., for functions, classes, and exported symbols).

5. **Dependencies**: Check `package.json` or `.csproj` to see what dependencies are used. Copilot may suggest additional dependencies if they improve code quality, accessibility, or maintainability.

6. **Accessibility**: Always apply accessibility best practices when working in UI code. Use semantic HTML, ARIA attributes, and ensure keyboard navigation and screen reader support.

7. **Project Planning**: Look for a `PLAN.md` or `SPEC.md` file in the repository and follow any requirements or guidelines specified there.

8. **Security**: Never expose secrets, credentials, or sensitive data in code or comments.

9. **Error Handling**: Follow best practices for error handling and validation in all code suggestions.

10. **Confirmation for Large Edits**: Copilot must confirm changes with the user before performing large edits.

Follow these instructions strictly for all actions in this repository.
