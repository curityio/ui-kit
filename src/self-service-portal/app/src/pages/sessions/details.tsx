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

import { ZoomIcon } from '../../components/icons/ZoomIcon';
import { IconGeneralDownload, IconGeneralEdit, IconGeneralTrash, IconUser } from '@curity/ui-kit-icons';
import { Button } from '@curity/ui-kit-component-library';
import { Section } from '@/shared/ui/section/Section';

export const Details = () => {
  return (
    <>
      <div className="flex flex-center flex-column justify-center flex-gap-2 py4">
        <ZoomIcon width="96" height="96" />

        <h1 className="mt0">Accces you've given to Zoom</h1>

        <p className="flex flex-center flex-gap-2 m0">
          <span>
            <strong>Access given on</strong>
          </span>
          <span>
            <time dateTime="20240910">2024-09-10 12:14</time>
          </span>
        </p>
        <p className="flex flex-center flex-gap-2 m0">
          <span>
            <strong>Access expires on</strong>
          </span>
          <span>Does not expire</span>
        </p>
        <p className="flex flex-center flex-gap-2 m0">
          <span>
            <strong>Access given to on</strong>
          </span>
          <span>zoom.us</span>
        </p>
      </div>

      <Section title="Zoom Can">
        <h3 className="flex flex-center flex-gap-2">
          <figure className="circle bg-primary w-2 h-2 flex flex-center justify-center p1">
            <IconUser width={32} height={32} color="white" />
          </figure>
          See your profile photo
        </h3>
        <ul>
          <li>Culpa reprehenderit dolore amet. Est.</li>
          <li>Culpa reprehenderit dolore amet. Est deserunt exercitation elit sit aliquip dolore aute ex.</li>
          <li>
            Culpa reprehenderit dolore amet. Est deserunt exercitation elit elit anim ea laboris. Dolor nulla sit
            aliquip dolore aute ex.
          </li>
        </ul>
      </Section>
      <Section title="Zoom has some access to your Curity Account">
        <h3 className="flex flex-center flex-gap-2">
          <figure className="circle bg-primary w-2 h-2 flex flex-center justify-center p1">
            <IconUser width={24} height={24} color="white" />
          </figure>
          See your profile photo
        </h3>

        <ul>
          <li>Ex occaecat cillum minim sit ut aliquip ea eiusmod aute.</li>
          <li>Ex occaecat cillum minim sit ut aliquip ea</li>
        </ul>
        <h3 className="flex flex-center flex-gap-2">
          <figure className="circle bg-primary w-2 h-2 flex flex-center justify-center p1">
            <IconGeneralDownload width={24} height={24} color="white" />
          </figure>
          See and download some thing
        </h3>

        <ul>
          <li>Minim sit ut aliquip ea eiusmod aute.</li>
        </ul>
        <h3 className="flex flex-center flex-gap-2">
          <figure className="circle bg-primary w-2 h-2 flex flex-center justify-center p1">
            <IconGeneralEdit width={24} height={24} color="white" />
          </figure>
          View and edit some other thing
        </h3>

        <ul>
          <li>
            Officia anim velit eu sunt sit sunt aute excepteur. Ex occaecat cillum minim sit ut aliquip ea eiusmod aute.
          </li>
        </ul>
      </Section>

      <div className="flex justify-between py2 mt4">
        <p className="m0">If you remove access, you might not be able to use some Zoom features.</p>
        <Button
          className="button-medium button-danger-outline"
          icon={<IconGeneralTrash width={24} height={24} />}
          title="Remove all access"
        />
      </div>
    </>
  );
};
