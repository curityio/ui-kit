/*
 * Copyright (C) 2032 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

import { IconFacilitiesEmail, IconFacilitiesSms, IconGeneralArrowForward, IconGeneralLocation } from '@icons';
import { Section } from '@shared/ui/Section.tsx';
import { Account } from '@/shared/data-access/API';
import { List, ListCell, ListRow } from '@/shared/ui';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

interface ContactInfoProps {
  account: Account;
}

export const ContactInfo = ({ account }: ContactInfoProps) => {
  const { t } = useTranslation();
  const contactListConfig = [
    {
      title: t('Email'),
      collection: 'emails' as const,
      link: '/security/email',
      className: 'flex flex-center flex-gap-1 flex-30',
      icon: <IconFacilitiesEmail width={32} height={32} />,
    },
    {
      title: t('Phone number'),
      collection: 'phoneNumbers' as const,
      link: '/security/phone',
      className: 'flex flex-center flex-gap-1 flex-30',
      icon: <IconFacilitiesSms width={32} height={32} />,
    },
    {
      title: t('Address'),
      collection: 'addresses' as const,
      link: '/account/address',
      className: 'flex flex-center flex-gap-1 flex-30',
      icon: <IconGeneralLocation width={32} height={32} />,
    },
  ];

  return (
    <Section title={t('Contact information')}>
      <List className="sm-flex flex-column flex-gap-3">
        {contactListConfig.map((config, index) => (
          <ListRow key={index}>
            <ListCell className={config.className}>
              {config.icon}
              <label>{config.title}</label>
            </ListCell>
            <ListCell className="flex-70 flex flex-start flex-gap-1 justify-between">
              {getAccountElements(config.collection, account, t)}

              <Link to={config.link} className="button button-small button-transparent">
                <IconGeneralArrowForward width={24} height={24} />
              </Link>
            </ListCell>
          </ListRow>
        ))}
      </List>
    </Section>
  );
};

const getAccountElements = (collection: 'emails' | 'addresses' | 'phoneNumbers', account: Account, t: TFunction) => {
  return account?.[collection]?.map((element, index) => (
    <div className="flex flex-gap-1" key={index}>
      {'value' in element! && <span>{element.value}</span>}
      {'streetAddress' in element! && <span>{element.streetAddress}</span>}
      {element?.primary && <span className="pill pill-grey">{t('Primary')}</span>}
    </div>
  ));
};
