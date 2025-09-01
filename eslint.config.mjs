// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";
import oxlint from "eslint-plugin-oxlint";
import skipFormattingConfig from "@vue/eslint-config-prettier/skip-formatting";

export default withNuxt(
  ...oxlint.buildFromOxlintConfigFile("./.oxlintrc.json"),
  skipFormattingConfig,
);
