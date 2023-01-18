import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { rust } from "@codemirror/lang-rust";
import { xml } from "@codemirror/lang-xml";
import { java } from "@codemirror/lang-java";
import { wast } from "@codemirror/lang-wast";
import { php } from "@codemirror/lang-php";
import { lezer } from "@codemirror/lang-lezer";
import { python } from "@codemirror/lang-python";

export const langs = {
  javascript: javascript(),
  cpp: cpp(),
  html: html(),
  css: css(),
  json: json(),
  markdown: markdown(),
  rust: rust(),
  xml: xml(),
  java: java(),
  wast: wast(),
  php: php(),
  lezer: lezer(),
  python: python(),
};

export const langOptions = [
  "javascript",
  "cpp",
  "html",
  "css",
  "json",
  "markdown",
  "rust",
  "xml",
  "java",
  "php",
  "lezer",
  "python",
];
