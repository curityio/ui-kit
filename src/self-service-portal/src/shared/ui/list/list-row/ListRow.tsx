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

import { HTMLAttributes, JSX } from 'react';
import { ListItem } from '../list-item.model';
import { ListCell } from '../..';
import { IconGeneralArrowForward, IconGeneralTrash } from '@icons';
import { Button } from '../../Button';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

interface ListRowProps<T> extends HTMLAttributes<HTMLLIElement> {
  item?: T;
  itemLinkButtonLabel?: string;
  renderIcon?: JSX.Element;
  onItemDelete?: (item: T) => void;
  showDelete?: boolean;
  className?: string;
  children?: React.ReactNode;
}
export const ListRow = <T extends ListItem<T>>({
  item,
  itemLinkButtonLabel,
  renderIcon,
  showDelete = false,
  onItemDelete,
  className,
  children,
  ...props
}: ListRowProps<T>) => {
  const { t } = useTranslation();

  return (
    <li {...props}>
      <div className={className ? className : 'flex flex-center justify-between flex-gap-2 w100'}>
        {children || (
          <>
            <ListCell className="flex flex-40 flex-center flex-gap-2 p2">
              {renderIcon && renderIcon}
              {item?.name}
            </ListCell>
            {item?.message && (
              <ListCell className="flex-20">
                <span>{item?.message}</span>
              </ListCell>
            )}
            <ListCell className="flex flex-center justify-between flex-gap-2">
              <Link to={item?.link || ''} className="button button-small button-transparent">
                {itemLinkButtonLabel}
                <IconGeneralArrowForward width={24} height={24} />
              </Link>
              {showDelete && item && (
                <Button
                  className="button-small button-danger-outline"
                  aria-label={t('delete row')}
                  onClick={() => onItemDelete?.(item)}
                  icon={<IconGeneralTrash width={18} height={18} />}
                />
              )}
            </ListCell>
          </>
        )}
      </div>
    </li>
  );
};
