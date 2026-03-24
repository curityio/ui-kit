/*
 * Copyright (C) 2025 Curity AB. All rights reserved.
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

  addEntryChangeListener(listener: (state: unknown) => void): void;

  addEntry(state: unknown, url: string): void;
}

class BrowserHistoryNavigation implements HistoryNavigation {
  public readonly initialUrl = window.location.href;
  private firstEntry = true;

  addEntryChangeListener(listener: (state: unknown) => void): void {
    window.addEventListener('popstate', event => {
      listener(event.state);
    });
  }

  addEntry(state: unknown, url: string): void {
    if (this.firstEntry) {
      // Account for the initial API request, in which case the current history entry should be reused and
      // updated with the resulting state.
      this.firstEntry = false;
      window.history.replaceState(state, '');
    } else {
      window.history.pushState(state, '', url);
    }
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
