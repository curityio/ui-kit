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

import { IconGeneralCheckmarkCircled, IconGeneralPlus, IconGeneralTrash } from '@icons';
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '..';
import { Column } from './typings';
import { EmptyState } from '../EmptyState';
import { useTranslation } from 'react-i18next';
import { ConfirmButton } from '@/shared/ui/ConfirmButton';
import { SearchField } from '@/shared/ui/search-field/SearchField';
import { useState } from 'react';
import { UI_CONFIG_OPERATIONS, UI_CONFIG_RESOURCES } from '@/ui-config/typings';
import { UiConfigIf } from '@/ui-config/feature/UiConfigIf';

interface DataTableProps<T> {
  columns: Column<T>[];
  data?: T[] | null;
  title?: string;
  showSearch?: boolean;
  showCreate?: boolean;
  showDelete?: boolean;
  createButtonLabel?: string;
  customActions?: (row: T) => React.ReactNode;
  onSearch?: (query: string) => void;
  onCreateNew?: () => void;
  onRowDelete?: T extends null ? never : (row: T) => void;
  uiConfigResources?: UI_CONFIG_RESOURCES[];
  'data-testid'?: string;
}

export const DataTable = <T,>({
  title,
  columns,
  data,
  showSearch = true,
  showCreate = true,
  showDelete = true,
  createButtonLabel,
  onSearch,
  onCreateNew,
  onRowDelete,
  customActions,
  uiConfigResources,
  'data-testid': testId,
}: DataTableProps<T>) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const defaultRender = (value: unknown) => {
    if (value === true) {
      return (
        <IconGeneralCheckmarkCircled
          width={36}
          height={36}
          color="var(--color-success)"
          data-testid="data-table-icon-general-checkmark-circled"
        />
      );
    }
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return value;
    }

    return null;
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const emptyStateHeading = searchQuery ? t('no-results-found') : t('no-title-available', { title });

  const emptyStateText = searchQuery
    ? t('adjust-search')
    : `${t('empty-state-list', { title })}${showCreate ? ` ${t('add-new', { createButtonLabel })}` : ''}`;

  return (
    <div data-testid={testId}>
      {(showSearch || showCreate) && (
        <div className={`flex flex-gap-2 flex-center flex-wrap justify-${showSearch ? 'between' : 'end'} py2`}>
          {showSearch && (
            <SearchField
              title={title?.toLocaleLowerCase() ?? ''}
              length={data?.length ?? 0}
              onSearch={handleSearch}
              autoFocus
            />
          )}
          {showCreate && (
            <div>
              <UiConfigIf resources={uiConfigResources} allowedOperations={[UI_CONFIG_OPERATIONS.CREATE]}>
                <Button
                  className="button-small button-primary"
                  onClick={onCreateNew}
                  icon={<IconGeneralPlus width={24} height={24} />}
                  title={`${t('new')} ${createButtonLabel}`}
                  data-testid="data-table-create-button"
                />
              </UiConfigIf>
            </div>
          )}
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col, index) => (
              <TableHead key={index}>{col.label}</TableHead>
            ))}
            {(showDelete || customActions) && (
              <TableHead className="right-align" key="actions">
                {t('actions')}
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.length ? (
            data?.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((col, index) => (
                  <TableCell key={index}>
                    {col.customRender ? col.customRender(row) : defaultRender(row[col.key as keyof T])}
                  </TableCell>
                ))}
                {(showDelete || customActions) && (
                  <TableCell>
                    <div className="flex flex-center justify-end flex-gap-2">
                      {customActions && customActions(row)}
                      {
                        // @ts-expect-error TODO: Fix this typing
                        showDelete && !row?.primary && (
                          <UiConfigIf resources={uiConfigResources} allowedOperations={[UI_CONFIG_OPERATIONS.DELETE]}>
                            <ConfirmButton
                              className="button-tiny button-danger-outline"
                              dialogMessage={t('confirm-delete')}
                              onConfirm={() => onRowDelete?.(row)}
                              aria-label={t('delete-item')}
                              icon={<IconGeneralTrash width={18} height={18} data-testid="data-table-delete-button" />}
                            />
                          </UiConfigIf>
                        )
                      }
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                {...{ colSpan: columns.length + (showDelete || customActions ? 1 : 0) }}
                className="center"
                data-testid="data-table-cell-empty-state"
              >
                <EmptyState heading={emptyStateHeading} text={emptyStateText} />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
