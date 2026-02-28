/* 
RegExp for:
	1. Opened tags: <div, <div class, <div>
	2. Closed tags: </div>
	3. Self-closing tags: <img />, <br/>
	4. Exclude comments: <!-- comment -->
	5. Return only tag name: div, span, Card, etc.
*/
export const TAG_NAME_REGEX =
  /<(?!!--)(\/?)([a-zA-Z][a-zA-Z0-9]*)(?:\s[^>]*?)?(\s*\/?>)/g;

export const SUPPORTED_LANGS = [
  "html",
  "typescriptreact",
  "javascriptreact",
  "vue",
  "xml",
];
export const MAX_FILE_SIZE = 100000;
export const DEBOUNCE_DELAY = 300;
