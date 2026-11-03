import js from "@eslint/js";
import globals from "globals";
import {defineConfig} from "eslint/config";

export default defineConfig([
  {files: ["**/*.{js,ts,jsx,tsx}"], plugins: {js}, extends: ["js/recommended"]},
  {files: ["**/*.{js,ts,jsx,tsx}"], languageOptions: {globals: globals.browser}},
  {languageOptions: {ecmaVersion: 2019, sourceType: "module"}},
  {rules: {"no-cond-assign": 0, "no-constant-condition": 0, "no-prototype-builtins": 0}},
  {files: ["test/**/*.js"], languageOptions: {globals: globals.node}}
]);
