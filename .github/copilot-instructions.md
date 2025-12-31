## Copilot instructions for SmartHR / konvertHRMS

This repository is a TypeScript + React (Vite) admin template with feature-based modules and heavy lazy-loading. Use these notes to be immediately productive and avoid common pitfalls.

- **Big picture**: app entry in `src/main.tsx` wires providers and performance flags. Routing is feature-based and lazy-loaded: see `src/router/router.tsx` and `src/router/router.link.tsx` which map paths to lazy components exported from `src/router/lazyRoutes`.

- **Where to make changes**:
  - UI pages / features: `src/feature-module/` and `src/KHRModules/` (module-specific code lives here).
  - Global components and providers: `src/core/` (providers, modals, hooks, utils).
  - API layer: `src/api/axiosInstance.ts` (axios with auth interceptors). Some local services still use `fetch` (see `src/apiHandling/Service/*`). Prefer `axiosInstance` for authenticated endpoints.

- **Build / test / dev commands** (exact from `package.json`):
  - Install: `npm install`
  - Dev server: `npm run dev`
  - Build: `npm run build` (runs `tsc -b` then `vite build`)
  - Preview production build: `npm run preview`
  - Analyze bundles: `npm run build:analyze`
  - Tests: `npm test` (uses `vitest`; UI runner available via `npm run test:ui`)
  - Lint: `npm run lint`

- **Patterns & conventions**:
  - Routing: add new routes by updating `src/router/lazyRoutes` (exports) and `src/router/router.link.tsx` (mapping). Routes are wrapped in `Suspense`.
  - Code-splitting: components are lazy-loaded by feature — follow existing lazy import style.
  - API responses: many service helpers return `{ data, total }` (see `src/apiHandling/Service/userService.ts`) — keep this shape for pagination compatibility with hooks like `useFetchData`.
  - Hooks: shared hooks live under `src/core/hooks` or `src/apiHandling/Hook`. Look at `useFetchData.ts` for pagination + search patterns.
  - State: Redux Toolkit is used; store and types are under `src/core/data`.

- **Auth & network specifics**:
  - `src/api/axiosInstance.ts` contains interceptors and a hard-coded `baseURL` (local IP). When modifying endpoints, prefer using `VITE_API_BASE_URL` env var and avoid hard-coded URLs.
  - Token handling: `axiosInstance` auto-fetches a token and stores it in `localStorage.authToken`. Beware of corrupt storage (code checks for stray keys like `dataColor`, `unique_user_id`). To reproduce auth issues, clear `localStorage.authToken`.

- **Tests & CI tips**:
  - Use `vitest` for unit tests; run `npm test -- --coverage` for coverage.
  - Because the project uses TypeScript build (`tsc -b`) in `build`, CI should run `npm run build` to validate types before publishing.

- **Common gotchas found in this repo**:
  - Mixed network patterns: some services use `fetch` while central API uses `axios` with interceptors. Standardize on `src/api/axiosInstance.ts` for authenticated endpoints.
  - Hard-coded `baseURL` inside `axiosInstance.ts` — switch to `import.meta.env.VITE_API_BASE_URL` for production.
  - Large `lazyRoutes` export: when adding routes, ensure the component is exported in `src/router/lazyRoutes` and mapped in `router.link.tsx`.

- **Quick examples**:
  - Calling authenticated API:
    ```ts
    import Instance from '../api/axiosInstance';
    const res = await Instance.get('/employees');
    ```
  - Adding a route: export the page in `src/router/lazyRoutes.tsx`, then add mapping in `src/router/router.link.tsx`.

If anything here is incomplete or you want additional examples (tests, CI, or code-style rules), tell me which area to expand.  
