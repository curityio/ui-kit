import { AuthorizedScope, AuthorizedClaim } from '@/shared/data-access/API';
import { List, ListRow, ListCell } from '@/shared/ui';
import { useTranslation } from 'react-i18next';

interface AppsAndServicesDetailListProps {
  collection?: (AuthorizedScope | AuthorizedClaim)[];
}

export const AppsAndServicesDetailList = ({ collection }: AppsAndServicesDetailListProps) => {
  const { t } = useTranslation();

  return (
    <List>
      {collection?.length ? (
        collection.map((element, index) => (
          <ListRow key={index} className="flex flex-gap-3">
            <ListCell>
              <h3>{element.localizedName || element.name}</h3>
            </ListCell>
            {element.description && <ListCell>{element.description}</ListCell>}
          </ListRow>
        ))
      ) : (
        <ListRow>
          <ListCell>{t('No results found')}</ListCell>
        </ListRow>
      )}
    </List>
  );
};
