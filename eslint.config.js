import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import nextPlugin from "@next/eslint-plugin-next";

export default [
  {
    ignores: [".next/**", ".next/types/**", "Legacy/**", "www/**"],
  },
  // Global configuration for all files
  {
    files: ["**/*.{js,mjs,cjs}", "!apps/web/.next/**"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
    },
  },
  // Configuration for TypeScript files in apps/web
  {
    files: ["apps/web/**/*.{ts,tsx}", "!apps/web/.next/**"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./apps/web/tsconfig.json"],
      },
      globals: globals.browser,
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      react: react,
      "@next/next": nextPlugin,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "react/react-in-jsx-scope": "off", // Next.js doesn't require React to be in scope
      "react/jsx-uses-react": "off", // Not needed with new JSX transform
      "@typescript-eslint/no-explicit-any": "off", // Removed
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  // Configuration for TypeScript files in packages/lib
  {
    files: ["packages/lib/**/*.{ts,tsx}", "!apps/web/.next/**"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./packages/lib/tsconfig.json"],
      },
      globals: globals.node,
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "off", // Removed
    },
  },
  // Configuration for other TypeScript files (e.g., scripts)
  {
    files: ["scripts/**/*.{ts,tsx}", "*.{ts,tsx}", "!apps/web/**/*.{ts,tsx}", "!packages/lib/**/*.{ts,tsx}", "!apps/web/.next/**"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: null,
      },
      globals: globals.node,
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "off", // Removed
    },
  },
];