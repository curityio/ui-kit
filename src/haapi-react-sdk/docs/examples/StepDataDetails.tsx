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

import type { HaapiStep } from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-step.types';

// Minimal JSON token colours, readable on the translucent panel in both light and dark.
const JSON_COLORS = { key: '#9d174d', string: '#0b7285', number: '#b45309', keyword: '#6d28d9' };

/** Render a value as syntax-highlighted JSON HTML (keys, strings, numbers and keywords coloured). */
function highlightJson(value: unknown): string {
  const json = JSON.stringify(value, null, 2);
  const escaped = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return escaped.replace(
    /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
    token => {
      let color: string = JSON_COLORS.number;
      if (token.startsWith('"')) {
        color = token.endsWith(':') ? JSON_COLORS.key : JSON_COLORS.string;
      } else if (token === 'true' || token === 'false' || token === 'null') {
        color = JSON_COLORS.keyword;
      }
      return `<span style="color:${color}">${token}</span>`;
    }
  );
}

/**
 * A collapsed "See HAAPI step data" view of the raw HAAPI step the preview is rendering — a
 * syntax-highlighted JSON panel shown below the form so readers can correlate the UI with its step data.
 */
export function StepDataDetails({ step }: { step: HaapiStep }) {
  // Inline styles override the Curity stylesheet's global `details`/`summary` box so this docs panel
  // reads as a deliberate, neutral card rather than a login-form field.
  return (
    <details
      style={{
        marginTop: '1rem',
        border: '1px solid rgba(127, 127, 127, 0.3)',
        borderRadius: '8px',
        padding: '0.5rem 0.75rem',
        background: 'rgba(127, 127, 127, 0.04)',
      }}
    >
      <summary style={{ cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, margin: 0, padding: '0.25rem 0' }}>
        See HAAPI step data
      </summary>
      <pre
        style={{
          marginTop: '0.5rem',
          padding: '1rem',
          overflow: 'auto',
          maxHeight: '20rem',
          fontSize: '0.8125rem',
          lineHeight: 1.5,
          background: 'rgba(127, 127, 127, 0.12)',
          borderRadius: '6px',
        }}
        dangerouslySetInnerHTML={{ __html: highlightJson(step) }}
      />
    </details>
  );
}
