/*
 * Copyright (C) 2024 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

import { IconGeneralArrowForward, IconToken } from '@curity-ui-kit/icons';
import { Button, DataTable, PageHeader } from '../shared/ui';
import { useTranslation } from 'react-i18next';
import { Column } from '@/shared/ui/data-table/typings';

// TODO: remove this type when it is available in GraphQL schema
type Session = {
  id: string;
  created: string;
  remaining: string;
  authorized_client: string;
  logo: string;
  name: string;
  description: string;
};

export const Sessions = () => {
  const { t } = useTranslation();

  const data: Session[] = [
    {
      id: '4567fuygvibon',
      created: '17 hours ago',
      remaining: '30 minutes',
      authorized_client: 'google1',
      logo: `<svg width="256" height="262" viewBox="0 0 256 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"/><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"/><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"/><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"/></svg>`,
      name: 'Google client used for something',
      description:
        'Elit minim fugiat est pariatur fugiat. Nisi sit consequat ullamco consectetur ut minim ea magna voluptate deserunt sint Lorem dolor cupidatat do.',
    },
    {
      id: 'cvb456d7ctu',
      created: '17 hours ago',
      remaining: '30 minutes',
      authorized_client: 'spotify_test',
      logo: `<svg viewBox="0 0 256 256" width="256" height="256" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path d="M128 0C57.308 0 0 57.309 0 128c0 70.696 57.309 128 128 128 70.697 0 128-57.304 128-128C256 57.314 198.697.007 127.998.007l.001-.006Zm58.699 184.614c-2.293 3.76-7.215 4.952-10.975 2.644-30.053-18.357-67.885-22.515-112.44-12.335a7.981 7.981 0 0 1-9.552-6.007 7.968 7.968 0 0 1 6-9.553c48.76-11.14 90.583-6.344 124.323 14.276 3.76 2.308 4.952 7.215 2.644 10.975Zm15.667-34.853c-2.89 4.695-9.034 6.178-13.726 3.289-34.406-21.148-86.853-27.273-127.548-14.92-5.278 1.594-10.852-1.38-12.454-6.649-1.59-5.278 1.386-10.842 6.655-12.446 46.485-14.106 104.275-7.273 143.787 17.007 4.692 2.89 6.175 9.034 3.286 13.72v-.001Zm1.345-36.293C162.457 88.964 94.394 86.71 55.007 98.666c-6.325 1.918-13.014-1.653-14.93-7.978-1.917-6.328 1.65-13.012 7.98-14.935C93.27 62.027 168.434 64.68 215.929 92.876c5.702 3.376 7.566 10.724 4.188 16.405-3.362 5.69-10.73 7.565-16.4 4.187h-.006Z" fill="#1ED760"/></svg>`,
      name: 'Spotify internal',
      description:
        'Elit minim fugiat est pariatur fugiat. Nisi sit consequat ullamco consectetur ut minim ea magna voluptate deserunt sint Lorem dolor cupidatat do.',
    },
    {
      id: 'cvb45ss6d7ctu',
      created: '3 weeks ago',
      remaining: '2 days',
      authorized_client: 'zoom_TEST',
      logo: `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" preserveAspectRatio="xMidYMid" viewBox="0 0 256 256"><defs><linearGradient id="a" x1="23.666%" x2="76.334%" y1="95.6118%" y2="4.3882%"><stop offset=".00006%" stop-color="#0845BF"/><stop offset="19.11%" stop-color="#0950DE"/><stop offset="38.23%" stop-color="#0B59F6"/><stop offset="50%" stop-color="#0B5CFF"/><stop offset="67.32%" stop-color="#0E5EFE"/><stop offset="77.74%" stop-color="#1665FC"/><stop offset="86.33%" stop-color="#246FF9"/><stop offset="93.88%" stop-color="#387FF4"/><stop offset="100%" stop-color="#4F90EE"/></linearGradient></defs><path fill="url(#a)" d="M256 128c0 13.568-1.024 27.136-3.328 40.192-6.912 43.264-41.216 77.568-84.48 84.48C155.136 254.976 141.568 256 128 256c-13.568 0-27.136-1.024-40.192-3.328-43.264-6.912-77.568-41.216-84.48-84.48C1.024 155.136 0 141.568 0 128c0-13.568 1.024-27.136 3.328-40.192 6.912-43.264 41.216-77.568 84.48-84.48C100.864 1.024 114.432 0 128 0c13.568 0 27.136 1.024 40.192 3.328 43.264 6.912 77.568 41.216 84.48 84.48C254.976 100.864 256 114.432 256 128Z"/><path fill="#FFF" d="M204.032 207.872H75.008c-8.448 0-16.64-4.608-20.48-12.032-4.608-8.704-2.816-19.2 4.096-26.112l89.856-89.856H83.968c-17.664 0-32-14.336-32-32h118.784c8.448 0 16.64 4.608 20.48 12.032 4.608 8.704 2.816 19.2-4.096 26.112l-89.6 90.112h74.496c17.664 0 32 14.08 32 31.744Z"/></svg>`,
      name: 'Zoom Meetings',
      description:
        'Elit minim fugiat est pariatur fugiat. Nisi sit consequat ullamco consectetur ut minim ea magna voluptate deserunt sint Lorem dolor cupidatat do.',
    },
  ];

  const columns: Column<Session>[] = [
    { key: 'id', label: t('session.session-id') },
    { key: 'created', label: t('account.created') },
    { key: 'remaining', label: t('session.time-remaining') },
    { key: 'authorized_client', label: t('Authorized client') },
    {
      key: 'name',
      label: t('session.authorized-client-name'),
      customRender: (session: { [key: string]: string }) => (
        <div className="flex flex-center flex-gap-2 p2">
          <img src={session.logo} alt={session.id} className="block w-3 h-3" />
          <span>{session.name}</span>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title={t('session.title')}
        description={t('session.description')}
        icon={<IconToken width={128} height={128} />}
      />

      <DataTable
        title={t('session.title')}
        columns={columns}
        data={data}
        showCreate={false}
        onRowDelete={row => console.log('delete clicked for', row)}
        onSearch={(query: string) => console.log('Search:', query)}
        customActions={row => (
          <Button
            className="button-small button-transparent"
            icon={<IconGeneralArrowForward width={24} height={24} />}
            title={t('view-details')}
            onClick={() => console.log('View details clicked for:', row)}
          />
        )}
      />
    </>
  );
};
