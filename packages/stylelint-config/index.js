export default {
  extends: "stylelint-config-sass-guidelines",
  plugins: ["stylelint-order"],
  rules: {
    "max-nesting-depth": [
      3,
      {
        ignoreAtRules: ["each", "media", "supports", "include"]
      }
    ],
    "scss/at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["starting-style"]
      }
    ],
    "selector-class-pattern": [
      "^[a-z0-9\\-_]+$",
      {
        message:
          "Selector should be written in lowercase with hyphens and/or underscores (selector-class-pattern)"
      }
    ],
    "order/properties-alphabetical-order": true,
    "selector-no-qualifying-type": null
  }
};
