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

import { ConfirmButton } from '@/shared/ui/ConfirmButton';
import { Section } from '@/shared/ui/section/Section';
import { useMutation } from '@apollo/client';
import { useAuth } from '@auth/data-access/AuthProvider.tsx';
import { IconGeneralTrash } from '@curity-ui-kit/icons';
import { GRAPHQL_API } from '@shared/data-access/API/GRAPHQL_API.ts';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

interface AccountDeleteProps {
  id: string;
  username: string;
}

export const AccountDelete = ({ id, username }: AccountDeleteProps) => {
  const { t } = useTranslation();
  const [isDeleteConfirmed, setIsDeleteConfirmed] = useState(false);
  const [deleteAccountById] = useMutation(GRAPHQL_API.USER_MANAGEMENT.MUTATIONS.deleteAccountById);
  const authContext = useAuth();

  const deleteUserAccount = async () => {
    if (isDeleteConfirmed) {
      try {
        await deleteAccountById({
          variables: {
            input: {
              accountId: id,
              deleteAccountLinks: true,
            },
          },
        });

        toast.success(t('account.delete.success'));

        setTimeout(async () => {
          await authContext.logout();
        }, 1800);
      } catch {
        toast.error(t('error.account.delete'));
      }
    }
  };

  return (
    <>
      <Section title={t('account.delete')} data-testid="user-account-delete-section">
        <p>{t('account.delete.description')}</p>
        <ConfirmButton
          className="button-small button-danger-outline"
          icon={<IconGeneralTrash width={18} height={18} />}
          title={t('account.delete')}
          onConfirm={deleteUserAccount}
          onCancel={() => setIsDeleteConfirmed(false)}
          dialogConfig={{
            title: t('account.delete'),
            subTitle: t('account.delete.title'),
            actionButtonText: t('account.delete'),
            isActionButtonDisabled: !isDeleteConfirmed,
            children: (
              <div>
                <p className="mb-4">
                  {t('account.delete.confirmation.description', {
                    id: username,
                  })}
                </p>
                <label className="flex flex-center justify-center flex-gap-1">
                  <input
                    type="checkbox"
                    checked={isDeleteConfirmed}
                    onChange={e => setIsDeleteConfirmed(e.target.checked)}
                    data-testid="user-account-delete-checkbox"
                  />
                  <span>{t('account.delete.confirmation.confirmation')}</span>
                </label>
              </div>
            ),
          }}
        />
      </Section>
    </>
  );
};
