import {
  ApolloClient,
  ApolloLink,
  from,
  fromPromise,
  HttpLink,
  InMemoryCache,
  NextLink,
  Operation,
} from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { Outlet } from 'react-router';
import { GraphQLAPIProviderProps, GRAPQL_API_ENDPOINTS } from './typings';
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename';
import { GRAPHQL_API } from '@/shared/data-access/API/GRAPHQL_API';
import { onError } from '@apollo/client/link/error';
import { getAuthContextAPIFromOutsideRenderContext } from '@/auth/data-access/AuthProvider';
import { toast } from 'react-hot-toast';
import { GRAPHQL_API_ERROR_MESSAGES } from '@/shared/data-access/API/GRAPHQL_API_ERROR_MESSAGES';
import { useUiConfig } from '@/ui-config/data-access/UiConfigProvider';
import { UiConfig } from '@/ui-config/typings';
import i18n from 'i18next';
import { GraphQLFormattedError } from 'graphql/error/GraphQLError';
import { useMemo } from 'react';

export function GraphQLAPIProvider({ children }: GraphQLAPIProviderProps) {
  const uiConfig = useUiConfig();

  const graphQLAPIClient = useMemo(() => buildGraphQLClient(uiConfig), [uiConfig]);

  return <ApolloProvider client={graphQLAPIClient}>{children ? children : <Outlet />}</ApolloProvider>;
}

const buildGraphQLClient = (uiConfig: UiConfig) => {
  const removeTypenameLink = removeTypenameFromVariables();
  const graphqlApiEndpointResolverLink = new ApolloLink((operation, forward) => {
    const queryName = operation.query.definitions.find(def => def.kind === 'OperationDefinition')?.name?.value;
    const graphqlApiEndpoint = getGraphQLEndpoint(queryName);

    operation.setContext({
      graphqlApiEndpoint: graphqlApiEndpoint,
    });

    return forward(operation);
  });
  const httpLink = new HttpLink({
    uri: ({ getContext }) => {
      const { graphqlApiEndpoint } = getContext();

      return getGraphQLClientURI(graphqlApiEndpoint, uiConfig);
    },
    credentials: 'include',
  });
  const errorLink = onError(({ networkError, graphQLErrors, operation, forward }) => {
    const isUnauthorizedRequest = networkError && 'statusCode' in networkError && networkError?.statusCode === 401;

    if (isUnauthorizedRequest) {
      return retryUnauthorizedRequestsOnce(operation, forward);
    }

    if (networkError) {
      toast.error(i18n.t('error.load'), {
        id: 'error-loading',
      });
    }

    if (graphQLErrors) {
      graphQLErrors.forEach(error => {
        const { message, path } = error;
        const errorMessage = getGraphQLErrorMessage(operation, error, message);

        toast.error(i18n.t(errorMessage), {
          id: path?.join('-'),
        });
      });
    }
  });

  const graphQLClient = new ApolloClient({
    link: from([errorLink, removeTypenameLink, graphqlApiEndpointResolverLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'network-only',
      },
      mutate: {
        fetchPolicy: 'network-only',
      },
      watchQuery: {
        fetchPolicy: 'network-only',
      },
    },
  });

  return graphQLClient;
};

const retryUnauthorizedRequestsOnce = (operation: Operation, forward: NextLink) => {
  const authContextAPI = getAuthContextAPIFromOutsideRenderContext();

  return fromPromise(authContextAPI.refresh()).flatMap(() => forward(operation));
};

const getGraphQLEndpoint = (queryName?: string) => {
  return (
    Object.values(GRAPQL_API_ENDPOINTS).find(endpoint => {
      const endpointQueriesAndMutations = [
        ...Object.keys(GRAPHQL_API[endpoint]?.QUERIES),
        ...Object.keys(GRAPHQL_API[endpoint]?.MUTATIONS),
      ];

      return queryName && endpointQueriesAndMutations.includes(queryName);
    }) || GRAPQL_API_ENDPOINTS.USER_MANAGEMENT
  );
};

const getGraphQLClientURI = (graphqlApiEndpoint: GRAPQL_API_ENDPOINTS, uiConfig: UiConfig) => {
  let grapQLClientPath;

  switch (graphqlApiEndpoint) {
    case GRAPQL_API_ENDPOINTS.USER_MANAGEMENT:
      grapQLClientPath = uiConfig.PATHS.USER_MANAGEMENT_API;
      break;

    case GRAPQL_API_ENDPOINTS.GRANTED_AUTHORIZATION:
      grapQLClientPath = uiConfig.PATHS.GRANTED_AUTHORIZATION_API;
      break;

    default:
      throw new Error(`Unknown GraphQL API endpoint type: ${graphqlApiEndpoint}`);
  }
  const grapQLClientURI = `${uiConfig.PATHS.BACKEND}${grapQLClientPath}`;

  return grapQLClientURI;
};

const getGraphQLErrorMessage = (operation: Operation, error: GraphQLFormattedError, graphqlApiErrorMessage: string) => {
  const errorClassification = error.extensions?.classification;
  const displayGraphQLErrorMessage =
    errorClassification === 'too-many-attempts-error' ||
    errorClassification === 'credential-update-rejected' ||
    errorClassification === 'localized-validation-error';

  if (displayGraphQLErrorMessage) {
    return graphqlApiErrorMessage;
  }

  const graphQLOperation = operation.operationName as keyof typeof GRAPHQL_API_ERROR_MESSAGES;
  const errorMessage = GRAPHQL_API_ERROR_MESSAGES?.[graphQLOperation] || graphqlApiErrorMessage;

  return errorMessage;
};
