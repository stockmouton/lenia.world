module.exports = {
  env: {
    browser: true,
    es2021: true,
    mocha: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'prettier',
  ],
  globals: {
    task: "readonly",
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    "import/no-extraneous-dependencies": ["error", {"devDependencies": ["deploy/**", "test/**", "tasks/**", "hardhat.config.js", "gatsby-node.js"]}],
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "react/prop-types": "off",
    "react/jsx-props-no-spreading": "off",
  },
  overrides: [
    {
      "files": ["deploy/**", "scripts/**", "tasks/**"],
      "rules": {
        "no-console": "off",
      }
    },
    {
      "files": ["scripts/**", "tasks/**", "test/**"],
      "rules": {
        "no-await-in-loop": "off"
      }
    },
  ],
};
