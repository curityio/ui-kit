# @curity/ui-kit-component-library

The Curity React Component Library is a collection of reusable UI components designed for use across the ui-kit monorepo, including the self-service-portal, and other packages.

## Features

- 🎨 **Consistent Design System** - Unified styling across all Curity applications
- 📦 **Tree-shakeable** - Only import what you need
- 🎯 **TypeScript Support** - Full type definitions included
- ♿ **Accessible** - ARIA-compliant components
- 🎭 **CSS Modules** - Scoped styles with no conflicts
- 📱 **Responsive** - Mobile-first design approach

## Installation

This is installed by default when you install the `@curity/ui-kit` package. You can also install it separately in your React project:

```bash
npm install @curity/ui-kit-component-library
```

## Usage

### Import Components

```tsx
import { Button, Table, Dialog } from '@curity/ui-kit-component-library';
import '@curity/ui-kit-component-library/dist/component-library.css';
```

### Example

```tsx
import { Button, Alert } from '@curity/ui-kit-component-library';
import '@curity/ui-kit-component-library/dist/component-library.css';

function App() {
  return (
    <>
      <Alert type="success" message="Operation completed!" />
      <Button onClick={() => console.log('Clicked!')}>
        Click Me
      </Button>
    </>
  );
}
```

## Available Components

### Layout & Navigation
- **Breadcrumbs** - Navigation breadcrumb trail
- **Header** - Application header with navigation
- **PageHeader** - Page title section with icon
- **Section** - Content section container
- **Sidebar** - Collapsible navigation sidebar

### Forms & Input
- **Button** - Primary action button
- **ConfirmButton** - Button with confirmation dialog
- **Input** - Text input field
- **OtpInput** - One-time password input
- **SearchField** - Search input with icon
- **Toggle** - Toggle switch control

### Data Display
- **Table** - Data table with sorting
  - `TableHeader` - Table header row
  - `TableBody` - Table body container
  - `TableRow` - Table row
  - `TableHead` - Table header cell
  - `TableCell` - Table data cell
- **List** - List container
  - `ListRow` - List row item
  - `ListCell` - List cell content
- **EmptyState** - Empty state placeholder

### Feedback
- **Alert** - Alert messages
- **Dialog** - Modal dialog
- **Spinner** - Loading spinner
- **SuccessCheckmark** - Success animation
- **ProgressSteps** - Step progress indicator

### Utilities
- **SlashDivider** - Visual divider
- **UserMenu** - User dropdown menu
- **toUiKitTranslation** - Translation helper function

## Development

### Prerequisites

- Node.js >= 22.22.0
- npm >= 10.9.4

### Scripts

```bash
# Start development server
npm run dev

# Build the library
npm run build

# Watch mode (rebuild on changes)
npm run watch

# Run tests
npm run test

# Run linter
npm run lint
```

### Building

The library is built using Vite and outputs:
- ESM bundle: `dist/component-library.js`
- UMD bundle: `dist/component-library.umd.cjs`
- CSS bundle: `dist/component-library.css`
- TypeScript definitions: `dist/index.d.ts`

### CSS Modules

Components use CSS Modules for scoped styling. When building, all CSS is bundled into a single `component-library.css` file that must be imported in consuming applications.

```tsx
import '@curity/ui-kit-component-library/dist/component-library.css';
```

## Architecture

```
src/
├── components/        # React components
│   ├── Button.tsx
│   ├── table/
│   │   ├── Table.tsx
│   │   └── table.module.css
│   └── ...
├── hooks/            # Shared React hooks
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Dependencies

### Peer Dependencies
- `react` ^18.0.0
- `react-dom` ^18.0.0

### Internal Dependencies
- `@curity/ui-kit-css` - Base CSS styles
- `@curity/ui-kit-icons` - Icon library
- `react`
- `react-router` - Routing support
- `@radix-ui/react-dialog` - Dialog support

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Apache-2.0 - Copyright (C) 2024 Curity AB. All rights reserved.
