import "@testing-library/jest-dom/vitest";

class ResizeObserverMock {
  observe() {}
  disconnect() {}
  unobserve() {}
}

window.ResizeObserver = ResizeObserverMock as typeof ResizeObserver;
window.HTMLElement.prototype.scrollTo = function scrollTo() {};
window.HTMLCanvasElement.prototype.getContext = () => null;
