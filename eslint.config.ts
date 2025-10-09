// eslint.config.ts
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import path from 'node:path';

const SRC_DIR = path.resolve('./src');
const TEST_DIR = path.resolve('./test');

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    files: [`${SRC_DIR}/**/*.{ts,tsx,js,vue}`, `${TEST_DIR}/**/*.{ts,tsx,js,vue}`],
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/*.config.*',
      '**/*.conf.*',
      '**/scripts/**',
    ],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'max-len': 'off',
      'arrow-body-style': 'off',
    },
  }
);
