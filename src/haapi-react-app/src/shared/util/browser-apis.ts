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

// History

export interface HistoryNavigation {
  readonly initialUrl: string;

  /** Registers a listener for browser back/forward navigation. Returns a function that removes it. */
  addEntryChangeListener(listener: (state: unknown) => void): () => void;

  /** Updates the current history entry's state, keeping the current URL (reuses the entry). */
  replaceEntry(state: unknown, url?: string): void;

  /** Appends a new history entry (keeping the current URL), discarding any forward entries. */
  pushEntry(state: unknown, url?: string): void;

  /** The state attached to the current history entry (null when none was set). */
  getState(): unknown;

  go(delta: number): void;
}

// Stateless wrapper over `window.history`. It holds no per-flow state (e.g. "is this the first entry?"):
// that decision belongs to the consumer, so the adapter can be a shared singleton with no lifecycle coupling.
class BrowserHistoryNavigation implements HistoryNavigation {
  public readonly initialUrl = window.location.href;

  addEntryChangeListener(listener: (state: unknown) => void): () => void {
    const handler = (event: PopStateEvent) => {
      listener(event.state);
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }

  replaceEntry(state: unknown, url?: string): void {
    window.history.replaceState(state, '', url);
  }

  pushEntry(state: unknown, url?: string): void {
    window.history.pushState(state, '', url);
  }

  getState(): unknown {
    return window.history.state;
  }

  go(delta: number): void {
    window.history.go(delta);
  }
}

export const browserHistoryNavigation: HistoryNavigation = new BrowserHistoryNavigation();

// Scheduled tasks

export type DelayedOrWhenVisibleExecutor = typeof delayedOrWhenVisible;

/**
 * Schedules the execution of a callback after a given delay, or as soon as the document becomes visible after
 * going hidden.
 * If the document becomes hidden and the delay expires, the callback is not be executed at that time, but when the
 * document becomes visible again.
 *
 * @param callback the callback to execute
 * @param delay the maximum delay in milliseconds
 * @return a function to cancel the scheduled execution
 */
export function delayedOrWhenVisible(callback: () => void, delay: number): () => void {
  const timeoutId = setTimeout(() => {
    document.removeEventListener('visibilitychange', onVisibilityChange);
    callback();
  }, delay);

  const onVisibilityChange = () => {
    if (document.hidden) {
      clearTimeout(timeoutId);
    } else {
      callback();
    }
  };

  document.addEventListener('visibilitychange', onVisibilityChange);

  return () => {
    clearTimeout(timeoutId);
    document.removeEventListener('visibilitychange', onVisibilityChange);
  };
}
