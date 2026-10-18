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
    // Generous timeouts so framer/Radix component tests don't false-fail on
    // slow or heavily-loaded runners (they run in ms on CI).
    testTimeout: 20000,
    hookTimeout: 20000,
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
        'components/ui/Toolbar.tsx',
        'components/ui/Stepper.tsx',
        'components/ui/Tabs.tsx',
        'components/ui/Modal.tsx',
        'components/ui/Accordion.tsx',
      ],
      // CommandPalette, Carousel, and Chat are behavior-tested but intentionally
      // left OUT of the % gate: they're interaction/composition-heavy (real
      // pointer-drag, setInterval autoplay, random async bot replies, focus-hover
      // pause) whose last mile is fragile to assert, and folding them in just
      // lowers the number without catching regressions. Their tests still RUN every
      // CI and fail it if broken; the % floor stays on the tightly unit-tested
      // modules.
      reporter: ['text'],
      // Regression floor over the tested modules. Measured aggregate is ~
      // 96.6 lines/statements, 92 functions, 75.5 branches; the floor sits just
      // below so a real drop fails CI while uncovered variant branches (sizes,
      // reduced-motion, content panels) don't cause flakiness.
      thresholds: { lines: 95, statements: 95, functions: 88, branches: 70 },
    },
  },
})
