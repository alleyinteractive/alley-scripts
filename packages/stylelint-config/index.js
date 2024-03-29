module.exports = {
  "extends": "stylelint-config-sass-guidelines",
  "rules": {
    "max-nesting-depth": [
      3,
      {
        "ignoreAtRules": [
          "each",
          "media",
          "supports",
          "include"
        ]
      }
    ],
    "selector-class-pattern": [
      "^[a-z0-9\\-_]+$",
      {
        "message":
        "Selector should be written in lowercase with hyphens and/or underscores (selector-class-pattern)"
      }
    ],
    "selector-no-qualifying-type": null
  }
}