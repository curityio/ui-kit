import { PageHeader } from '@/shared/ui';
import { IconGeneralArrowBack, IconGeneralEyeHide } from '@icons';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

export const FeatureNotAvailable = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-center justify-center flex-column py4" data-testid="feature-not-available">
      <PageHeader
        title={t('Feature Not Available')}
        description={t('The configuration for this app does not include the feature you are trying to access.')}
        icon={<IconGeneralEyeHide width={128} height={128} />}
      />
      <Link to="/" className="button button-medium button-primary">
        <IconGeneralArrowBack width={24} height={24} />
        {t('Go home')}
      </Link>
    </div>
  );
};
