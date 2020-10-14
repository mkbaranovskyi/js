# Formatting

- [Formatting](#formatting)
  - [Sources](#sources)
  - [Prettier](#prettier)
  - [ESLint](#eslint)
  - [Airbnb](#airbnb)

---

## Sources

1. https://www.youtube.com/watch?v=SydnKbGc7W8 - tutorial
2. https://eslint.org/docs/rules/ - eslint
3. https://www.npmjs.com/package/eslint-config-airbnb - airbnb

---

## Prettier

1. Install **Prettier** (Ctrl + P): `ext install esbenp.prettier-vscode`
2. Open `settings.json` and paste at the end:

```json
"prettier.singleQuote": true,
"prettier.trailingComma": "none",
"prettier.useTabs": true,
"prettier.semi": false,
"editor.formatOnSave": true
```

Alternatively you can edit these settings from the GUI.

Now your code will be formatted on save automatically.

To **ignore** some files create the `.prettierignore` file and place it to the root of the currently opened folder in VS Code:

```bash
# Ignore all `md` files
*.md
```

---

## ESLint

1. `sudo npm i -g eslint`
2. Install the `ESLint` extension
3. Make sure you have your `package.json`
4. In the project folder: `eslint --init`, answer the questions.

Now your code will highlight various problems and suggest fixes.

You can modify the rules, see https://eslint.org/docs/rules/

---

## Airbnb

An optional set of rules.

1. `npm i -D prettier eslint-plugin-prettier eslint-config-prettier eslint-plugin-node eslint-config-node`
2. `npx install-peerdeps --dev eslint-config-airbnb-base`
3. Insert these basic settings and then **modify them to your taste**:

**.eslintrc.json**

```json
{
	"extends": ["airbnb", "prettier", "plugin:node/recommended"],
	"plugins": ["prettier"],
	"rules": {
		"no-unused-vars": "warn",
		"no-console": "off",
		"consistent-return": "off",
		"no-param-reassign": "warn",
		"class-methods-use-this": "off"
	}
}
```

You can see what the problem's name is and change the rule (in `.eslintrc.json`) if you like:

![](img/2020-10-08-17-36-03.png)
