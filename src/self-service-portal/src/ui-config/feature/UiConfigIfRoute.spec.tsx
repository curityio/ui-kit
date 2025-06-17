import * as UiConfigProviderAll from '@/ui-config/data-access/UiConfigProvider';
import { UiConfigProvider } from '@/ui-config/data-access/UiConfigProvider';
import { UI_CONFIG_OPERATIONS, UI_CONFIG_RESOURCES } from '@/ui-config/typings';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { UiConfigIfRoute } from './UiConfigIfRoute';
import * as utils from '@/ui-config/utils/ui-config-if-utils';
import { MemoryRouter, Route, Routes } from 'react-router';
import { ROUTE_PATHS } from '@/routes';
import { FeatureNotAvailable } from '@/shared/ui/FeatureNotAvailable';
import { UI_CONFIG } from '@/ui-config/ui-config.ts';
import { mockUiConfigProvider } from '../../shared/utils/test';

describe('UiConfigIfRoute', () => {
  beforeEach(() => {
    mockUiConfigProvider();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Route Access', () => {
    describe('allowAccessWithPartialPermissions (Some route resources have UIConfig operation permissions (default behavior))', () => {
      it('should allow accessing the route when some route resources have UIConfig permissions', async () => {
        const testId = 'route-with-permissions';

        vi.spyOn(utils, 'useCurrentRouteResources').mockReturnValue([
          UI_CONFIG_RESOURCES.USER_MANAGEMENT_NAME,
          UI_CONFIG_RESOURCES.USER_MANAGEMENT_ADDRESS,
        ]);

        const { findByTestId } = render(
          <MemoryRouter initialEntries={['/test']}>
            <UiConfigProvider>
              <Routes>
                <Route
                  path="/test"
                  element={
                    <UiConfigIfRoute>
                      <div data-testid={testId}>Content</div>
                    </UiConfigIfRoute>
                  }
                />
              </Routes>
            </UiConfigProvider>
          </MemoryRouter>
        );

        const contentWithPermissions = await findByTestId(testId);

        expect(contentWithPermissions).toBeVisible();
      });

      it('should navigate to "Feature Not Available" when all route resources do not have UIConfig permissions', async () => {
        const testId = 'feature-not-available';

        vi.spyOn(utils, 'useCurrentRouteResources').mockReturnValue([
          UI_CONFIG_RESOURCES.USER_MANAGEMENT_NAME,
          UI_CONFIG_RESOURCES.USER_MANAGEMENT_ADDRESS,
        ]);

        vi.spyOn(UiConfigProviderAll, 'useUiConfig').mockReturnValue({
          ...UI_CONFIG,
          resourceGroups: {
            ...UI_CONFIG.resourceGroups,
            userManagement: {
              ...UI_CONFIG.resourceGroups.userManagement,
              resources: {
                ...UI_CONFIG.resourceGroups.userManagement.resources,
                name: {
                  operations: [],
                },
                address: {
                  operations: [],
                },
              },
            },
          },
        });

        const { findByTestId } = render(
          <MemoryRouter initialEntries={['/test']}>
            <UiConfigProvider>
              <Routes>
                <Route
                  path="/test"
                  element={
                    <UiConfigIfRoute>
                      <div>Content</div>
                    </UiConfigIfRoute>
                  }
                />
                <Route path={'test/' + ROUTE_PATHS.FEATURE_NOT_AVAILABLE} element={<FeatureNotAvailable />} />
              </Routes>
            </UiConfigProvider>
          </MemoryRouter>
        );

        const featureNotAvailable = await findByTestId(testId);

        expect(featureNotAvailable).toBeVisible();
      });
    });

    describe('!allowAccessWithPartialPermissions (Every route resource has UIConfig operation permissions)', () => {
      it('should allow accessing the route when every route resource has UIConfig permissions', async () => {
        const testId = 'route-with-permissions';

        vi.spyOn(utils, 'useCurrentRouteResources').mockReturnValue([
          UI_CONFIG_RESOURCES.USER_MANAGEMENT_NAME,
          UI_CONFIG_RESOURCES.USER_MANAGEMENT_ADDRESS,
        ]);

        const { findByTestId } = render(
          <MemoryRouter initialEntries={['/test']}>
            <UiConfigProvider>
              <Routes>
                <Route
                  path="/test"
                  element={
                    <UiConfigIfRoute allowAccessWithPartialResourcePermissions={false}>
                      <div data-testid={testId}>Content</div>
                    </UiConfigIfRoute>
                  }
                />
              </Routes>
            </UiConfigProvider>
          </MemoryRouter>
        );

        const contentWithPermissions = await findByTestId(testId);

        expect(contentWithPermissions).toBeVisible();
      });

      it('should navigate to "Feature Not Available" when some route resources do not have UIConfig permissions', async () => {
        const testId = 'feature-not-available';

        vi.spyOn(utils, 'useCurrentRouteResources').mockReturnValue([
          UI_CONFIG_RESOURCES.USER_MANAGEMENT_NAME,
          UI_CONFIG_RESOURCES.USER_MANAGEMENT_ADDRESS,
        ]);

        vi.spyOn(UiConfigProviderAll, 'useUiConfig').mockReturnValue({
          ...UI_CONFIG,
          resourceGroups: {
            ...UI_CONFIG.resourceGroups,
            userManagement: {
              ...UI_CONFIG.resourceGroups.userManagement,
              resources: {
                ...UI_CONFIG.resourceGroups.userManagement.resources,
                name: {
                  operations: [],
                },
                address: {
                  operations: [UI_CONFIG_OPERATIONS.READ, UI_CONFIG_OPERATIONS.UPDATE],
                },
              },
            },
          },
        });

        const { findByTestId } = render(
          <MemoryRouter initialEntries={['/test']}>
            <UiConfigProvider>
              <Routes>
                <Route
                  path="/test"
                  element={
                    <UiConfigIfRoute allowAccessWithPartialResourcePermissions={false}>
                      <div>Content</div>
                    </UiConfigIfRoute>
                  }
                />
                <Route path={'test/' + ROUTE_PATHS.FEATURE_NOT_AVAILABLE} element={<FeatureNotAvailable />} />
              </Routes>
            </UiConfigProvider>
          </MemoryRouter>
        );

        const featureNotAvailable = await findByTestId(testId);

        expect(featureNotAvailable).toBeVisible();
      });
    });
  });
});
