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
  await expect(
    page.getByRole('heading', { name: 'Database Clients' }),
  ).toBeVisible();
});
