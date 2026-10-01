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

import { EXAMPLES, HAAPI_EXAMPLE } from './catalog';

// The selector options, grouped by catalog section (preserving the catalog's declaration order). Only
// browsable `kind: 'step'` entries are listed. Each group becomes an <optgroup>; each entry's key is the
// option value carried into the bootstrap URL.
const STEP_GROUPS: { section: string; options: { value: string; label: string }[] }[] = (
  Object.keys(EXAMPLES) as HAAPI_EXAMPLE[]
)
  .filter(key => EXAMPLES[key].kind === 'step')
  .reduce<{ section: string; options: { value: string; label: string }[] }[]>((groups, key) => {
    const entry = EXAMPLES[key];
    const group = groups.find(candidate => candidate.section === entry.section);
    const option = { value: key as string, label: entry.title };
    return group
      ? groups.map(candidate =>
          candidate === group ? { ...candidate, options: [...candidate.options, option] } : candidate
        )
      : [...groups, { section: entry.section, options: [option] }];
  }, []);

interface StepSelectProps {
  value: string;
  onChange: (step: string) => void;
}

/** A labelled dropdown for choosing which mocked HAAPI step the preview renders, grouped by section. */
export function StepSelect({ value, onChange }: StepSelectProps) {
  return (
    <div
      style={{
        marginBottom: '3rem',
        padding: '0.75rem 1rem',
        background: '#eef2ff',
        border: '1px solid #c7d2fe',
        borderLeft: '4px solid #6366f1',
        borderRadius: '8px',
      }}
    >
      <label
        htmlFor="step-select"
        style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#3730a3' }}
      >
        Step to display
      </label>
      <select
        id="step-select"
        value={value}
        onChange={event => onChange(event.target.value)}
        style={{ minWidth: '16rem', padding: '0.4rem 0.5rem', borderRadius: '6px', border: '1px solid #6366f1' }}
      >
        {STEP_GROUPS.map(group => (
          <optgroup key={group.section} label={group.section}>
            {group.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
