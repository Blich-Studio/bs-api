// commitlint.config.ts
import type { UserConfig } from '@commitlint/types';

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat','fix','chore','docs','refactor','perf','test']],
    'subject-empty': [2, 'never'],
    'header-max-length': [2, 'always', 100],
  }
};

export default config;
