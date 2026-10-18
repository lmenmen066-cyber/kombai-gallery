import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// jsdom omits some layout/observer browser APIs our components touch; provide
// inert shims so unit tests exercise behavior instead of throwing on these.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function scrollIntoView() {}
}
// jsdom lacks Element.prototype.scrollTo/scrollBy (Chat's auto-scroll, dock, etc).
Element.prototype.scrollTo = Element.prototype.scrollTo || function scrollTo() {}
Element.prototype.scrollBy = Element.prototype.scrollBy || function scrollBy() {}
if (!('scrollTo' in window)) {
  Object.defineProperty(window, 'scrollTo', { value: () => {}, writable: true, configurable: true })
}
if (!('matchMedia' in window)) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}
if (!('IntersectionObserver' in globalThis)) {
  // @ts-expect-error test shim
  globalThis.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  }
}

// Reset the DOM between tests; jest-dom adds matchers like toBeInTheDocument.
afterEach(() => cleanup())
