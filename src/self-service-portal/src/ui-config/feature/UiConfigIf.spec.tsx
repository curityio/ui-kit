import { UiConfigProvider } from '@/ui-config/data-access/UiConfigProvider';
import { UiConfigIf } from '@/ui-config/feature/UiConfigIf';
import { UI_CONFIG_OPERATIONS, UI_CONFIG_RESOURCES } from '@/ui-config/typings';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import * as utils from '@/ui-config/utils/ui-config-if-utils';
import { expectAsyncElementNotToBeFoundByTestId, mockUiConfigProvider } from '@/shared/utils/test';

describe('UiConfigIf', () => {
  beforeEach(() => {
    mockUiConfigProvider();

    // all the tests in this spec are related to the UIConfigIf component,
    // since useCurrentRouteResources() calls useLocation() which can be invoked only in a Router context,
    // we need to mock it to avoid errors when running the tests
    vi.spyOn(utils, 'useCurrentRouteResources').mockReturnValue([]);
  });

  it('should default to `read` permissions when not configured', async () => {
    const testId = 'content-with-permissions';

    const { findByTestId } = render(
      <UiConfigProvider>
        <UiConfigIf resources={[UI_CONFIG_RESOURCES.USER_MANAGEMENT_NAME]}>
          <div data-testid={testId}>Content</div>
        </UiConfigIf>
      </UiConfigProvider>
    );

    const contentWithPermissions = await findByTestId(testId);

    expect(contentWithPermissions).toBeVisible();
  });

  it('should grant `read` permissions when any other permission is allowed', async () => {
    const testId = 'content-with-permissions';

    const { findByTestId } = render(
      <UiConfigProvider>
        <UiConfigIf resources={[UI_CONFIG_RESOURCES.USER_MANAGEMENT_ADDRESS]}>
          <div data-testid={testId}>Content</div>
        </UiConfigIf>
      </UiConfigProvider>
    );

    const contentWithPermissions = await findByTestId(testId);

    expect(contentWithPermissions).toBeVisible();
  });

  it('should default to the route resources when not configured', async () => {
    const testId = 'content-with-route-resources';

    vi.spyOn(utils, 'useCurrentRouteResources').mockReturnValue([UI_CONFIG_RESOURCES.USER_MANAGEMENT_PHONE_NUMBER]);

    render(
      <UiConfigProvider>
        <UiConfigIf allowedOperations={[UI_CONFIG_OPERATIONS.UPDATE]}>
          <div data-testid={testId}>Content</div>
        </UiConfigIf>
      </UiConfigProvider>
    );

    await expectAsyncElementNotToBeFoundByTestId(testId);

    vi.restoreAllMocks();
  });

  describe('!displayWithPartialPermissions (Every element resource has UIConfig operation permissions (default behavior))', () => {
    it('should display the content when every operation configured is allowed by the UIConfig on every configured resource', async () => {
      const testId = 'content-with-permissions';

      const { findByTestId } = render(
        <UiConfigProvider>
          <UiConfigIf
            resources={[UI_CONFIG_RESOURCES.USER_MANAGEMENT_NAME, UI_CONFIG_RESOURCES.USER_MANAGEMENT_ADDRESS]}
            allowedOperations={[UI_CONFIG_OPERATIONS.READ]}
          >
            <div data-testid={testId}>Content</div>
          </UiConfigIf>
        </UiConfigProvider>
      );

      const contentWithPermissions = await findByTestId(testId);

      expect(contentWithPermissions).toBeVisible();
    });

    it('should NOT display the content when any operation configured is NOT allowed by the UIConfig on any configured resource', async () => {
      const testId = 'content-without-permissions';

      render(
        <UiConfigProvider>
          <UiConfigIf
            resources={[UI_CONFIG_RESOURCES.USER_MANAGEMENT_NAME, UI_CONFIG_RESOURCES.USER_MANAGEMENT_PHONE_NUMBER]}
            allowedOperations={[UI_CONFIG_OPERATIONS.UPDATE]}
          >
            <div data-testid={testId}>Content</div>
          </UiConfigIf>
        </UiConfigProvider>
      );

      await expectAsyncElementNotToBeFoundByTestId(testId);
    });
  });

  describe('displayWithPartialPermissions (Some element resources have UIConfig operation permissions)', () => {
    it('should display the content when some operations configured are allowed by the UIConfig on some resources', async () => {
      const testId = 'content-with-permissions';

      const { findByTestId } = render(
        <UiConfigProvider>
          <UiConfigIf
            resources={[UI_CONFIG_RESOURCES.USER_MANAGEMENT_NAME, UI_CONFIG_RESOURCES.USER_MANAGEMENT_ADDRESS]}
            allowedOperations={[UI_CONFIG_OPERATIONS.UPDATE]}
            displayWithPartialResourcePermissions={true}
          >
            <div data-testid={testId}>Content</div>
          </UiConfigIf>
        </UiConfigProvider>
      );

      const contentWithPermissions = await findByTestId(testId);

      expect(contentWithPermissions).toBeVisible();
    });

    it('should NOT display the content when any operation configured is NOT allowed by the UIConfig on any configured resource', async () => {
      const testId = 'content-without-permissions';

      render(
        <UiConfigProvider>
          <UiConfigIf
            resources={[UI_CONFIG_RESOURCES.USER_MANAGEMENT_NAME, UI_CONFIG_RESOURCES.USER_MANAGEMENT_ADDRESS]}
            allowedOperations={[UI_CONFIG_OPERATIONS.DELETE]}
            displayWithPartialResourcePermissions={true}
          >
            <div data-testid={testId}>Content</div>
          </UiConfigIf>
        </UiConfigProvider>
      );

      await expectAsyncElementNotToBeFoundByTestId(testId);
    });
  });
});
