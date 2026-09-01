import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { Text } from '@backstage/ui';

import { devopsDashboardTranslationRef } from '../../i18n';

export const DbClientsSection = () => {
  const { t } = useTranslationRef(devopsDashboardTranslationRef);

  return <Text>{t('dbClients.description')}</Text>;
};
