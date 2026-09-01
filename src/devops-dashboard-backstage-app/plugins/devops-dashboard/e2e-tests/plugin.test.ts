import { test, expect } from '@playwright/test';
import { signInToCurity } from '../../../e2e-test-utils';

test('renders the DevOps Dashboard page with the Database Clients section', async ({
  page,
}) => {
  await page.goto('/');
  await signInToCurity(page);

  const nav = page.getByRole('navigation', { name: 'sidebar nav' });
  const dashboardLink = nav.getByRole('link', { name: 'DevOps Dashboard' });
  await expect(dashboardLink).toBeVisible();
  await dashboardLink.click();

  const defaultSectionUrl = /\/devops-dashboard\/db-clients$/;
  await expect(page).toHaveURL(defaultSectionUrl);
  await expect(
    page.getByRole('tab', { name: 'Database Clients' }),
  ).toBeVisible();
  // The search field and the column headers only render when the live
  // searchDatabaseClients query succeeded — this asserts the whole data
  // plane: config, CORS, bearer token, GraphQL.
  await expect(
    page.getByRole('searchbox', { name: 'Search database clients' }),
  ).toBeVisible();
  await expect(
    page.getByRole('columnheader', { name: 'Client ID' }),
  ).toBeVisible();
});
