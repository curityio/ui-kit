import { PageHeader } from '@/shared/ui';
import { IconGeneralArrowBack, IconGeneralEyeHide } from '@curity/ui-kit-icons';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

export const FeatureNotAvailable = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-center justify-center flex-column py4" data-testid="feature-not-available">
      <PageHeader
        title={t('feature-not-available')}
        description={t('feature-missing')}
        icon={<IconGeneralEyeHide width={128} height={128} />}
        data-testid="feature-not-available-page-header"
      />
      <Link to="/" className="button button-medium button-primary">
        <IconGeneralArrowBack width={24} height={24} />
        {t('go-home')}
      </Link>
    </div>
  );
};
