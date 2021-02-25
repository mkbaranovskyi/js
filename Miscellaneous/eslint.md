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
4. https://www.youtube.com/watch?v=bfyI9yl3qfE - react

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

Node:

1. `sudo npm i -g eslint`
2. Install the `ESLint` extension
3. Make sure you have your `package.json`
4. In the project folder: `eslint --init`, answer the questions.

React:

1. `npm install eslint -D`
2. `npm init` if you don't have `package.json`
3. `npx eslint --init`

Now your code will highlight various problems and suggest fixes.

You can modify the rules, see https://eslint.org/docs/rules/

---

## Airbnb

An optional set of rules.

1. `npm i -D prettier eslint-plugin-prettier eslint-config-prettier eslint-plugin-node eslint-config-node`
2. `npx install-peerdeps --dev eslint-config-airbnb-base`
3. Create a `.eslintrc.json` file in you project folder and insert these basic settings. Then you can **modify them to your taste**:

_.eslintrc.json_

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

For React: https://www.youtube.com/watch?v=bfyI9yl3qfE

```json
{
	"env": {
		"browser": true,
		"es2021": true
	},
	"extends": ["eslint:recommended", "plugin:react/recommended"],
	"parserOptions": {
		"ecmaFeatures": {
			"jsx": true
		},
		"ecmaVersion": 12,
		"sourceType": "module"
	},
	"plugins": ["react"],
	"rules": {
		"react/prop-types": "warn"
	}
}
```

You can see what the problem's name is and change the rule (in `.eslintrc.json`) if you like:

![](img/2020-10-08-17-36-03.png)
