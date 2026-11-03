import js from "@eslint/js";
import globals from "globals";
import {defineConfig} from "eslint/config";

export default defineConfig([
  {ignores: ["dist/"]},
  {files: ["**/*.{js,ts}"], plugins: {js}, extends: ["js/recommended"]},
  {files: ["src/**/*.{js,ts}"], languageOptions: {globals: globals.browser}},
  {files: ["test/**/*.js"], languageOptions: {globals: globals.node}},
  {languageOptions: {ecmaVersion: 2019, sourceType: "module"}},
  {rules: {"no-cond-assign": 0, "no-constant-condition": 0, "no-prototype-builtins": 0}},
  {files: ["rollup.config.js"], languageOptions: {ecmaVersion: 2026}}
]);
