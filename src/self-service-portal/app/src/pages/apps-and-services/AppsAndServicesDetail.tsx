import { useAuth } from '@/auth/data-access/AuthProvider';
import { AppsAndServicesDetailList } from '@/pages/apps-and-services/AppsAndServicesDetailList';
import { ROUTE_PATHS } from '@/routes';
import { GRAPHQL_API } from '@/shared/data-access/API/GRAPHQL_API';
import { Button } from '@/shared/ui';
import { Section } from '@/shared/ui/section/Section';
import { useMutation, useQuery } from '@apollo/client';
import { IconAuthenticatorDefault, IconGeneralTrash } from '@curity/ui-kit-icons';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { getFormattedDate } from '@shared/utils/date.ts';
import { UI_CONFIG_OPERATIONS, UI_CONFIG_RESOURCES } from '@/ui-config/typings';
import { UiConfigIf } from '@/ui-config/feature/UiConfigIf';

export const AppsAndServicesDetail = () => {
  const { t } = useTranslation();
  const { id: appId } = useParams<{ id: string }>();
  const { session } = useAuth();
  const navigate = useNavigate();

  const { data: appResponse, loading } = useQuery(
    GRAPHQL_API.GRANTED_AUTHORIZATION.QUERIES.getGrantedAuthorizationsByOwnerAndClient,
    {
      variables: { owner: session?.idTokenClaims?.sub, clientId: appId!, first: 1 },
    }
  );
  const app = appResponse?.grantedAuthorizationsByOwnerAndClient.edges?.[0]?.node;

  useEffect(() => {
    if (!loading && !app) {
      navigate(`/${ROUTE_PATHS.APPS_AND_SERVICES}`);
    }
  }, [loading, app, navigate]);

  const [revokeGrantedAuthorizationsByOwnerAndClient] = useMutation(
    GRAPHQL_API.GRANTED_AUTHORIZATION.MUTATIONS.revokeGrantedAuthorizationsByOwnerAndClient
  );

  const handleRevokeGrantedAuthorizations = async () => {
    await revokeGrantedAuthorizationsByOwnerAndClient({
      variables: {
        input: {
          owner: session?.idTokenClaims?.sub,
          clientId: appId!,
        },
      },
    });

    navigate(`/${ROUTE_PATHS.APPS_AND_SERVICES}`);
  };

  return (
    <>
      <div className="flex flex-center flex-column justify-center flex-gap-2 center py4">
        {app?.authorizedClient?.logoUri ? (
          <img className="block w-5 h-5" src={app?.authorizedClient?.logoUri} alt={app?.authorizedClient?.id} />
        ) : (
          <IconAuthenticatorDefault className="block w-5 h-5" data-testid="apps-and-service-detail-header-icon" />
        )}

        <h1 className="mt0" data-testid="apps-and-service-detail-header-title">
          {t('apps-and-services.access-given')} {app?.authorizedClient?.name || app?.authorizedClient?.id}
        </h1>

        {app?.meta?.created && (
          <p className="flex flex-center flex-gap-2 m0" data-testid="apps-and-service-detail-header-description">
            <span>
              <strong>
                {t('apps-and-services.access-date')} {getFormattedDate(app?.meta?.created)}
              </strong>
            </span>
          </p>
        )}
      </div>

      <Section
        title={`${app?.authorizedClient?.name || app?.authorizedClient?.id} ${t('apps-and-services.partial-access')}`}
        data-testid="apps-and-service-detail-authorized-scopes-section"
      >
        <AppsAndServicesDetailList
          collection={app?.authorizedScopes}
          data-testid="apps-and-service-detail-authorized-scopes-list"
        />
      </Section>

      <Section
        title={`${app?.authorizedClient?.name || app?.authorizedClient?.id} ${t('apps-and-services.has-access')}`}
        data-testid="apps-and-service-detail-authorized-claims-section"
      >
        <AppsAndServicesDetailList
          collection={app?.authorizedClaims}
          data-testid="apps-and-service-detail-authorized-claims-list"
        />
      </Section>

      <div className="sm-flex flex-center justify-between py2 mt4">
        <p className="m0" data-testid="apps-and-service-detail-remove-access-description">
          {t('apps-and-services.feature-warning', {
            appId,
          })}
        </p>
        <UiConfigIf
          resources={[UI_CONFIG_RESOURCES.GRANTED_AUTHORIZATIONS_GRANTED_AUTHORIZATIONS]}
          allowedOperations={[UI_CONFIG_OPERATIONS.DELETE]}
        >
          <Button
            onClick={handleRevokeGrantedAuthorizations}
            className="button-small button-danger-outline"
            icon={<IconGeneralTrash width={24} height={24} />}
            title={t('apps-and-services.remove-all')}
            data-testid="apps-and-service-detail-revoke-access-button"
          />
        </UiConfigIf>
      </div>
    </>
  );
};
