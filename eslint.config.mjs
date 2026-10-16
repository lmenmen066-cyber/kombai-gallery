import coreWebVitals from "eslint-config-next/core-web-vitals";

// ESLint 9 flat config. eslint-config-next@16 exports a flat `Linter.Config[]`
// directly, so FlatCompat / the `.eslintrc` shim is no longer needed (and in
// fact crashes against the flat array). Same lint scope as the old config
// (next/core-web-vitals only) — we intentionally do not add next/typescript to
// avoid introducing new rules. `next lint` is removed in Next 16, so the lint
// script calls the ESLint CLI directly (`eslint .`).
const eslintConfig = [
  {
    ignores: [".next/**/*", "out/**/*", "build/**/*", "node_modules/**/*"],
  },
  ...coreWebVitals,
  {
    // eslint-config-next@16 promotes the new React Compiler hooks rules to
    // errors. They're opinionated and fire across ~9 existing, intentional
    // effects (reduced-motion short-circuits, external DOM sync, derived
    // resets). Downgrade just these two to warnings so the upgrade isn't a
    // sprawling refactor; every other rule (including real bugs) still errors.
    // We fixed the genuine one (DataTable) properly.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
    },
  },
];

export default eslintConfig;
