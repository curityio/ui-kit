import { useAuth } from '@/auth/data-access/AuthProvider';
import { AppsAndServicesDetailList } from '@/pages/apps-and-services/AppsAndServicesDetailList';
import { ROUTE_PATHS } from '@/routes';
import { GRAPHQL_API } from '@/shared/data-access/API/GRAPHQL_API';
import { Button } from '@/shared/ui';
import { Section } from '@/shared/ui/Section';
import { useMutation, useQuery } from '@apollo/client';
import { IconAuthenticatorDefault, IconGeneralTrash } from '@icons';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { getFormattedDate } from '@shared/utils/date.ts';

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
      navigate(ROUTE_PATHS.APPS_AND_SERVICES);
    }
  }, [loading, app, navigate]);

  const [revokeGrantedAuthorizations] = useMutation(
    GRAPHQL_API.GRANTED_AUTHORIZATION.MUTATIONS.revokeGrantedAuthorizationsByOwnerAndClient
  );

  const handleRevokeGrantedAuthorizations = async () => {
    await revokeGrantedAuthorizations({
      variables: {
        input: {
          owner: session?.idTokenClaims?.sub,
          clientId: appId!,
        },
      },
    });

    navigate(ROUTE_PATHS.APPS_AND_SERVICES);
  };

  return (
    <>
      <div className="flex flex-center flex-column justify-center flex-gap-2 py4">
        {app?.authorizedClient?.logoUri ? (
          <img className="block w-5 h-5" src={app?.authorizedClient?.logoUri} alt={app?.authorizedClient?.id} />
        ) : (
          <IconAuthenticatorDefault className="block w-5 h-5" />
        )}

        <h1 className="mt0">
          {t("Access you've given to")} {app?.authorizedClient?.name || app?.authorizedClient?.id}
        </h1>

        {app?.meta?.created && (
          <p className="flex flex-center flex-gap-2 m0">
            <span>
              <strong>
                {t('Access given on')} {getFormattedDate(app?.meta?.created)}
              </strong>
            </span>
          </p>
        )}
      </div>

      <Section
        title={`${app?.authorizedClient?.name || app?.authorizedClient?.id} ${t(
          'has some access to your Curity Account'
        )}`}
      >
        <AppsAndServicesDetailList collection={app?.authorizedScopes} />
      </Section>

      <Section title={`${app?.authorizedClient?.name || app?.authorizedClient?.id} ${t('can')}`}>
        <AppsAndServicesDetailList collection={app?.authorizedClaims} />
      </Section>

      <div className="flex justify-between py2 mt4">
        <p className="m0">
          {t('If you remove access, you might not be able to use some {{appId}} features', {
            appId,
          })}
        </p>
        <Button
          onClick={handleRevokeGrantedAuthorizations}
          className="button-small button-danger-outline"
          icon={<IconGeneralTrash width={24} height={24} />}
          title={t('Remove all access')}
        />
      </div>
    </>
  );
};
