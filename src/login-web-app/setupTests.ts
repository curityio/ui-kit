import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// bootstrap-configuration.ts throws at import time if window.__CONFIG__ is unset.
// @ts-expect-error window.__CONFIG__ is not declared on the Window type
window.__CONFIG__ = {
  initialUrl: 'https://example.test/auth',
  haapi: {
    clientId: 'test-client',
    tokenEndpoint: 'https://example.test/oauth/token',
  },
};

// jsdom doesn't implement <dialog> — minimal mocks for open/close state.
HTMLDialogElement.prototype.show = vi.fn(function mock(this: HTMLDialogElement) {
  this.open = true;
});

HTMLDialogElement.prototype.showModal = vi.fn(function mock(this: HTMLDialogElement) {
  this.open = true;
});

HTMLDialogElement.prototype.close = vi.fn(function mock(this: HTMLDialogElement) {
  this.open = false;
  this.dispatchEvent(new Event('close'));
});
