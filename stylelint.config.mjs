/** @type {import('stylelint').Config} */
const config = {
    extends: "stylelint-config-standard",
    rules: {
        "selector-nested-pattern": "^&",
    }
};

export default config;