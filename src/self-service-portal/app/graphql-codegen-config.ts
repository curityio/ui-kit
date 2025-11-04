import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: './src/shared/data-access/API/**/*.{graphql,graphqls}',
  documents: './src/**/*.{graphql,graphqls,tsx,ts}',
  ignoreNoDocuments: true,
  generates: {
    'src/shared/data-access/API/graphql-codegen-typings-queries-and-mutations/': {
      preset: 'client',
      presetConfig: {
        fragmentMasking: false,
      },
      plugins: [],
    },
  },
};

export default config;
