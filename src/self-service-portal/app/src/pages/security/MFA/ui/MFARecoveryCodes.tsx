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

import { Button, List, ListRow } from '../../../../shared/ui';
import { useTranslation } from 'react-i18next';

export interface RecoveryCodesProps {
  codes: string[];
}

export const MFARecoveryCodes = ({ codes }: RecoveryCodesProps) => {
  const { t } = useTranslation();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const text = codes.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'recovery_codes.txt';
    link.click();
  };

  return (
    <div className="border-light p3 br-8 " data-testid="mfa-recovery-codes">
      <header className="flex justify-end flex-center flex-gap-2">
        <Button className="button button-tiny button-primary-outline" title={'Print'} onClick={handlePrint} />
        <Button className="button button-tiny button-primary-outline" title={'Download'} onClick={handleDownload} />
      </header>
      <h2 className="mt0">{t('security.multi-factor-authentication.recovery-codes')}</h2>
      <p>{t('security.multi-factor-authentication.keep-recovery-note')}</p>
      <List className="m0 px2 py3 grid-container" md-columns="2" data-testid="mfa-recovery-codes-list">
        {codes.map((code, index) => (
          <ListRow key={index}>
            <code className="bg-white h4" data-testid="mfa-recovery-codes-list-code">
              {code}
            </code>
          </ListRow>
        ))}
      </List>
    </div>
  );
};
