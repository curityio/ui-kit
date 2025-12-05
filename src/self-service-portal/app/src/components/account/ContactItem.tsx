import { Button, ListCell, ListRow } from '@/shared/ui';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { IconGeneralArrowForward } from '@curity/ui-kit-icons';
import { Account, StringMultiValuedValue } from '@/shared/data-access/API';
import { getPrimaryOrFirstDevice } from '@/shared/utils/get-primary-or-first-device';
import { UiConfigIf } from '@/ui-config/feature/UiConfigIf';
import { UI_CONFIG_OPERATIONS, UI_CONFIG_RESOURCES } from '@/ui-config/typings';

interface ContactItemProps {
  title: string;
  icon: React.ReactNode;
  collection: 'emails' | 'phoneNumbers' | 'addresses';
  link?: string;
  account: Account;
  onVerify?: () => void;
  onChange?: () => void;
}

export const ContactItem = ({ title, icon, collection, link, account, onVerify, onChange }: ContactItemProps) => {
  const { t } = useTranslation();
  const deviceToShow = getPrimaryOrFirstDevice(account?.[collection] as StringMultiValuedValue[]);
  const deviceToShowIsVerified = deviceToShow?.type === 'verified';

  const renderContent = () => {
    if (collection === 'emails' || collection === 'phoneNumbers') {
      return (
        <div className="flex flex-center flex-gap-1" data-testid={`contact-info-${collection}-element`}>
          <span className="word-break-all">
            {deviceToShow?.value || t(`No ${collection === 'emails' ? 'email' : 'phone number'} available`)}
          </span>
        </div>
      );
    }

    if (collection === 'addresses' && !account?.addresses?.length) {
      return (
        <span>
          <em>{t('No addresses available')}</em>
        </span>
      );
    }

    const primaryElement = account?.[collection]?.find(element => element?.primary);

    return (
      <div className="flex flex-center flex-gap-1" data-testid={`contact-info-${collection}-element`}>
        <span>{primaryElement?.streetAddress}</span>
      </div>
    );
  };

  const renderActions = () => {
    if (collection === 'emails' && !deviceToShowIsVerified) {
      return (
        <UiConfigIf
          resources={[UI_CONFIG_RESOURCES.USER_MANAGEMENT_EMAIL]}
          allowedOperations={[UI_CONFIG_OPERATIONS.UPDATE]}
        >
          <Button
            title={t('account.verify')}
            className="button-tiny button-primary-outline"
            onClick={onVerify}
            data-testid={`contact-info-email-verify-button`}
          />
        </UiConfigIf>
      );
    }

    if (collection === 'phoneNumbers') {
      return (
        <div className="flex flex-start flex-gap-1">
          {deviceToShow && !deviceToShowIsVerified && (
            <UiConfigIf
              resources={[UI_CONFIG_RESOURCES.USER_MANAGEMENT_PHONE_NUMBER]}
              allowedOperations={[UI_CONFIG_OPERATIONS.UPDATE]}
            >
              <Button
                title={t('account.verify')}
                className="button-tiny button-primary-outline"
                onClick={onVerify}
                data-testid={`contact-info-phone-verify-button`}
              />
            </UiConfigIf>
          )}
          <UiConfigIf
            resources={[UI_CONFIG_RESOURCES.USER_MANAGEMENT_PHONE_NUMBER]}
            allowedOperations={[UI_CONFIG_OPERATIONS.UPDATE]}
          >
            <Button
              title={deviceToShow ? t('account.change') : t('account.phone.add-new')}
              className="button-tiny button-primary-outline"
              onClick={onChange}
              data-testid={`contact-info-phone-change-button`}
            />
          </UiConfigIf>
        </div>
      );
    }

    if (collection === 'addresses' && link) {
      return (
        <>
          <div></div>
          <Link to={link} className="button button-small button-transparent" data-testid="contact-info-addresses-link">
            <IconGeneralArrowForward width={24} height={24} />
          </Link>
        </>
      );
    }

    return null;
  };

  return (
    <ListRow>
      <ListCell className="flex flex-center flex-gap-1 flex-30">
        {icon}
        <label>{title}</label>
      </ListCell>
      <ListCell className="flex-70 flex flex-center flex-gap-1 justify-between">
        {renderContent()}
        {renderActions()}
      </ListCell>
    </ListRow>
  );
};
