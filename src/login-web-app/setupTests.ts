import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

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
