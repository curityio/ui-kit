import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DataTable } from './DataTable.tsx';
import { Column } from './typings.ts';
import * as UiConfigProviderAll from '../../../ui-config/data-access/UiConfigProvider.tsx';
import { UI_CONFIG } from '../../../ui-config/utils/ui-config-fixture.ts';
import { expectAsyncElementNotToBeFound, mockUseCurrentRouteResources } from '../../utils/test.ts';

interface TestElement {
  email: string;
  created: string;
}
const mockColumns: Column<TestElement>[] = [
  { key: 'email', label: 'Email' },
  { key: 'created', label: 'Created' },
];

const mockData = [
  { email: 'teddie.lastname@work.com', created: '17 hours ago' },
  { email: 'teddie@home.com', created: '3 weeks ago' },
];

describe('DataTable Component', () => {
  beforeAll(() => {
    vi.spyOn(UiConfigProviderAll, 'useUiConfig').mockReturnValue(UI_CONFIG);
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => {
          if (key === 'search') {
            return 'Search';
          }

          if (key === 'no-title-available') {
            return 'No Email addresses Available';
          }

          if (key === 'empty-state-list') {
            return 'Looks like you don’t have any Email addresses yet.';
          }

          if (key === 'add-new') {
            return 'Add a new Email to get started.';
          }
          if (key === 'account.email.title') {
            return 'Email addresses';
          }
          if (key === 'account.email') {
            return 'Email';
          }
          if (key === 'created') {
            return 'Created';
          }
          if (key === 'actions') {
            return 'Actions';
          }
          if (key === 'delete-item') {
            return 'delete item';
          }
          if (key === 'new') {
            return 'New';
          }
          return key;
        },
        i18n: { language: 'en' },
        ready: true,
      }),
      initReactI18next: {
        type: '3rdParty',
        init: () => {}, // Mock init function
      },
    }));
  });

  beforeEach(() => {
    mockUseCurrentRouteResources();
  });

  describe('Rendering', () => {
    it('should render the table title from config', async () => {
      render(<DataTable columns={mockColumns} data={mockData} title="Email addresses" />);

      const title = await screen.findByPlaceholderText(`Search ${mockData.length} email addresses...`);

      expect(title).not.toBeNull();
    });

    it('should render the table headers from config', async () => {
      render(<DataTable columns={mockColumns} data={mockData} title="Email addresses" showDelete />);

      const headers = await screen.findAllByRole('columnheader');

      expect(headers.length).toBe(mockColumns.length + 1);
      expect(headers[0].textContent).toBe('Email');
      expect(headers[1].textContent).toBe('Created');
      expect(headers[2].textContent).toBe('Actions');
    });

    it('should render the table rows from config', async () => {
      render(<DataTable columns={mockColumns} data={mockData} title="Email addresses" />);

      const rows = await screen.findAllByRole('row');

      expect(rows.length).toBe(mockData.length + 1);
      expect(rows[1].textContent).to.include('teddie.lastname@work.com');
      expect(rows[2].textContent).to.include('3 weeks ago');
    });

    describe('Empty data state rendering', () => {
      it('should render an appropriate message indicating no records are available', async () => {
        render(<DataTable columns={mockColumns} data={[]} title="Email addresses" />);

        const noDataMessage = await screen.findByText('No Email addresses Available');

        expect(noDataMessage).toBeInTheDocument();
      });

      it('should render a message prompting the user to add new data when the Create option is available', async () => {
        const title = 'Email addresses';
        const createButtonLabel = 'Email';

        render(
          <DataTable columns={mockColumns} data={[]} title={title} showCreate createButtonLabel={createButtonLabel} />
        );

        const expectedText = `Looks like you don’t have any ${title} yet. Add a new ${createButtonLabel} to get started.`;
        const createPromptMessage = await screen.findByText(expectedText);

        expect(createPromptMessage).toBeInTheDocument();
      });

      it('should only render an appropriate message without a create prompt when the Create option is disabled', async () => {
        render(<DataTable columns={mockColumns} data={[]} title="Email addresses" showCreate={false} />);

        const noDataMessage = await screen.findByText('No Email addresses Available');
        const createPromptMessage = screen.findByText(/Add a new/i);

        expect(noDataMessage).toBeInTheDocument();
        await expectAsyncElementNotToBeFound(createPromptMessage);
      });

      it('should render a search-specific message when data is empty due to a search query', async () => {
        const title = 'Email addresses';
        const onSearchMock = vi.fn();

        render(<DataTable columns={mockColumns} data={[]} title={title} showSearch onSearch={onSearchMock} />);

        const searchInput = await screen.findByRole('searchbox');
        fireEvent.change(searchInput, { target: { value: 'test@example.com' } });
        const searchMessage = await screen.findByTestId('data-table-cell-empty-state');

        expect(searchMessage).toBeInTheDocument();
      });
    });
  });

  describe('Search', () => {
    it('should display the search input when enabled from config', async () => {
      render(<DataTable columns={mockColumns} data={mockData} title="Email addresses" showSearch />);

      const searchInput = await screen.findByRole('searchbox');

      expect(searchInput).not.toBeNull();
    });

    it('should trigger the search callback when typing in the search input', async () => {
      const onSearchMock = vi.fn();
      render(
        <DataTable columns={mockColumns} data={mockData} title="Email addresses" showSearch onSearch={onSearchMock} />
      );

      const searchInput = await screen.findByRole('searchbox');
      fireEvent.change(searchInput, { target: { value: 'work' } });

      expect(onSearchMock).toHaveBeenCalledOnce();
      expect(onSearchMock).toHaveBeenCalledWith('work');
    });
  });

  describe('Actions', () => {
    describe('Row/Element Addition', () => {
      it('should display the create new button with custom text when enabled from config', async () => {
        render(<DataTable columns={mockColumns} data={mockData} createButtonLabel="Email" onCreateNew={vi.fn()} />);

        const createButton = await screen.findByText('New Email');

        expect(createButton).not.toBeNull();
      });

      it('should trigger the create callback when clicking the create button', async () => {
        const onCreateNewMock = vi.fn();
        render(
          <DataTable columns={mockColumns} data={mockData} createButtonLabel="Email" onCreateNew={onCreateNewMock} />
        );

        const createButton = await screen.findByText('New Email');
        fireEvent.click(createButton);

        expect(onCreateNewMock).toHaveBeenCalledOnce();
      });
    });

    describe('Delete', () => {
      it('should display the delete button when enabled from config', async () => {
        render(<DataTable columns={mockColumns} data={mockData} showDelete onRowDelete={vi.fn()} />);

        const deleteButtons = await screen.findAllByRole('button', { name: /delete item/i });

        expect(deleteButtons.length).toBe(mockData.length);
      });

      it('should trigger the delete callback when clicking the delete icon', async () => {
        const onRowDeleteMock = vi.fn();
        render(<DataTable columns={mockColumns} data={mockData} showDelete onRowDelete={onRowDeleteMock} />);

        const deleteButtons = await screen.findAllByTestId('confirm-button');
        fireEvent.click(deleteButtons[0]);

        const dialogConfirmButton = await screen.findByTestId('dialog-action-button');
        fireEvent.click(dialogConfirmButton);

        expect(onRowDeleteMock).toHaveBeenCalledOnce();
        expect(onRowDeleteMock).toHaveBeenCalledWith(mockData[0]);
      });
    });

    describe('Custom Actions', () => {
      it('should display custom actions when provided in config', async () => {
        const customActionsMock = (row: TestElement) => <button>Action for {row.email}</button>;
        render(<DataTable columns={mockColumns} data={mockData} customActions={customActionsMock} />);

        const actionButtons = await screen.findAllByRole('button', { name: /action for/i });

        expect(actionButtons.length).toBe(mockData.length);
        expect(actionButtons[0].textContent).toBe(`Action for ${mockData[0].email}`);
      });
    });
  });
});
