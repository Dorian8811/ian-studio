import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "node_modules/**",
    // La maqueta original de Claude Design se conserva intacta como
    // referencia; no forma parte del código de producción.
    "_design/**",
  ]),
]);

export default eslintConfig;
