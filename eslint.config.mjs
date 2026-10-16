import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Flat config, but reusing the legacy shared config via FlatCompat so this is a
// drop-in migration from `.eslintrc.json` (same scope: next/core-web-vitals only
// — we intentionally did NOT add next/typescript to avoid introducing new rules
// mid-migration). `next lint` is deprecated in Next 15 and gone in 16, so the
// lint script now calls the ESLint CLI directly (`eslint .`).
const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  {
    ignores: [".next/**/*", "out/**/*", "build/**/*", "node_modules/**/*"],
  },
  ...compat.extends("next/core-web-vitals"),
];

export default eslintConfig;
