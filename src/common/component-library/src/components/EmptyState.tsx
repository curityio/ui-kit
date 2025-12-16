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

import { IconGeneralPlus, IconGeneralEmptyStateIcon } from '@curity/ui-kit-icons';
import { TranslationFunction } from '@/types/util.type.ts';

interface EmptyStateProps {
  text?: string;
  heading: string;
  action?: (() => void) | ((event: React.MouseEvent<HTMLButtonElement>) => void);
  callToAction?: string;
  t: TranslationFunction;
}

export const EmptyState = ({ text, heading, action, callToAction, t }: EmptyStateProps) => {
  return (
    <section className="center" role="region" aria-labelledby="empty-state-heading" data-testid="empty-state">
      <div className="center">
        <IconGeneralEmptyStateIcon width="300" height="300" ariaLabel={t('empty-state-icon')} />
      </div>
      <h2 id="empty-state-heading" className="mt0">
        {heading}
      </h2>
      {!!text && <p>{text}</p>}
      {!!(action && callToAction) && (
        <button className="button button-small button-primary" onClick={action} aria-label={callToAction}>
          <IconGeneralPlus width={24} height={24} />
          {callToAction}
        </button>
      )}
    </section>
  );
};
