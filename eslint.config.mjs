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
];

export default eslintConfig;
