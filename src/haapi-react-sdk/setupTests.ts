/*
 * Copyright (C) 2026 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

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
