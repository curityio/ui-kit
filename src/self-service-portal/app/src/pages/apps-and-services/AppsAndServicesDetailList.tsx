import { AuthorizedClaim, AuthorizedScope } from '@/shared/data-access/API';
import { List, ListCell, ListRow, toUiKitTranslation } from '@curity/ui-kit-component-library';
import { useTranslation } from 'react-i18next';

interface AppsAndServicesDetailListProps {
  collection?: (AuthorizedScope | AuthorizedClaim)[];
}

export const AppsAndServicesDetailList = ({ collection, ...props }: AppsAndServicesDetailListProps) => {
  const { t } = useTranslation();
  const uiKitT = toUiKitTranslation(t);

  return (
    <List {...props}>
      {collection?.length ? (
        collection.map((element, index) => (
          <ListRow t={uiKitT} key={index} className="flex flex-gap-3">
            <ListCell>
              <h3>{element.localizedName || element.name}</h3>
            </ListCell>
            {element.description && <ListCell>{element.description}</ListCell>}
          </ListRow>
        ))
      ) : (
        <ListRow t={uiKitT}>
          <ListCell>{t('No results found')}</ListCell>
        </ListRow>
      )}
    </List>
  );
};
