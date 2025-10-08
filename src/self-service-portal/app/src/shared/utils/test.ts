import { expect } from 'vitest';
import { findByTestId } from '@testing-library/react';
import * as queries from '@testing-library/dom/types/queries';
import * as UiConfigProviderAll from '@/ui-config/data-access/UiConfigProvider';
import { UI_CONFIG } from '../../ui-config/utils/ui-config-fixture';
import * as utils from '@/ui-config/utils/ui-config-if-utils';

/**
 * It turns out to be tricky to test/tell if an async element was not eventually added to the DOM because of a condition (e.g. UiConfigIf checks).
 * findByTestId() can wait for async element to appear, but it will throw an error if the element is not found.
 * This function uses exactly that implementation detail to check if the element was not eventually found.
 */
export const expectAsyncElementNotToBeFoundByTestId = async (testId: string) => {
  await expect(findByTestId(document.body, testId)).rejects.toThrow();
};

export const expectAsyncElementNotToBeFound = async (element: ReturnType<queries.FindByRole>) => {
  await expect(element).rejects.toThrow();
};

export const mockUiConfigProvider = () => {
  mockMetadataEndpointResponse();
};

/*
 * All the tests of components using UIConfigIf need to mock the useCurrentRouteResources()
 * since it calls useLocation() which can be invoked only in a Router context.
 */
export const mockUseCurrentRouteResources = () => {
  vi.spyOn(utils, 'useCurrentRouteResources').mockReturnValue([]);
};

export const mockUseUiConfig = () => {
  vi.spyOn(UiConfigProviderAll, 'useUiConfig').mockReturnValue(UI_CONFIG);
};

export const mockMetadataEndpointResponse = () => {
  const metaDataEndpointResponseStub = {
    endpoints: {
      oauthAgent: '/apps/self-service-portal-standalone/api',
      userManagement: '/um/graphql/admin',
      grantedAuthorization: '/granted-authorization/graphql',
    },
    messages: {},
    accessControlPolicy: UI_CONFIG.accessControlPolicy,
  };
  vi.stubGlobal('fetch', vi.fn());
  vi.mocked(fetch).mockResolvedValue({
    status: 200,
    ok: true,
    json: vi.fn().mockResolvedValue(metaDataEndpointResponseStub),
  } as unknown as Response);
};
