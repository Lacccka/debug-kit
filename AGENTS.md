# AGENTS

These guidelines apply to the entire repository.

## Code style

-   Use 4 spaces for indentation.
-   Use double quotes for strings and terminate statements with semicolons.
-   Prefer arrow functions for callbacks; keep functions small and focused.
-   Use ECMAScript modules; avoid CommonJS syntax.
-   Document non‑obvious logic with comments.

## Testing

Before committing:

-   `npm test` – run the unit tests.
-   `npm run build` – ensure the bundle builds without errors.
-   `npm run size` – verify the bundle size stays within expectations.

## Commit conventions

-   Write commit messages in English using the imperative mood.
-   Group related changes into a single commit.

## File organization

-   Place source files in `src/`.
-   Add tools under `src/tools/` and UI components under `src/ui/`.
-   Keep documentation in Markdown files alongside the code they describe.

## Documentation

-   Keep README and CHANGELOG up to date with code changes.
-   Provide Russian documentation with English summaries where helpful.
