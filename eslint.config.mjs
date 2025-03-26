import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Use `compat.extends` to add ESLint configurations
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // You can customize your rules here if needed
      // Disable React Hook rules if you want to avoid them for now
      "react-hooks/rules-of-hooks": "off",
      "@typescript-eslint/no-unused-vars": "warn", // Can change to "off" if preferred
      "@typescript-eslint/no-explicit-any": "warn", // Can change to "off" if preferred
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "prefer-const": "off",
      "@typescript-eslint/no-empty-interface": "off",
    },
  },
];

export default eslintConfig;
