import { fileURLToPath } from 'url'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Standalone Vitest config (Next owns the app build; Vitest just runs tests).
// jsdom environment + a setup that registers jest-dom matchers and auto-cleanup.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules/**', '.next/**', 'out/**'],
    coverage: {
      provider: 'v8',
      // Scope the gate to modules that have tests, so the threshold is
      // meaningful (whole-app coverage would be ~2% and always fail).
      include: [
        'lib/utils/cn.ts',
        'components/ui/Badge.tsx',
        'components/ui/Divider.tsx',
        'components/ui/Toggle.tsx',
        'components/ui/Spinner.tsx',
      ],
      reporter: ['text'],
      // Regression floor (measured current: 100/100/100 lines/stmts/funcs,
      // 75.6 branches). Sits just below actual so real drops fail CI while
      // minor uncovered variant branches don't cause flakiness.
      thresholds: { lines: 95, statements: 95, functions: 95, branches: 70 },
    },
  },
})
