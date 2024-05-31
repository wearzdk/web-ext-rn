import antfu from '@antfu/eslint-config';

export default antfu({
  react: true,
  stylistic: {
    semi: true,
  },
  rules: {
    'ts/no-use-before-define': 'off',
    'ts/no-require-imports': 'off',
    'no-console': 'off',
    'node/prefer-global/process': 'off',
    'react-hooks/exhaustive-deps': 'off',
  },
});
