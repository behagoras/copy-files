# 📁 dir-to-md

> Convert your project directories into Markdown with a single command — clipboard-ready, file-exportable, and fully customizable with `.gitignore`-like rules.

------

## 📦 Installation

### Local Project Use

```bash
npm install dir-to-md
```

### Global CLI Use

```bash
npm install -g dir-to-md
```

### Development Installation

```bash
git clone https://github.com/your-username/dir-to-md.git
cd dir-to-md
npm install
npm run build
npm pack
npm install -g ./dir-to-md-*.tgz
```

------

## 🚀 Usage

### ✨ Default Mode (Clipboard)

```bash
dir-to-md
```

Copies all non-ignored files from the current directory to your clipboard as a Markdown snippet.

------

### 🧩 Commands

#### 🔹 `copy`

Copy directory contents to **clipboard**:

```bash
dir-to-md copy
```

With custom ignore patterns:

```bash
dir-to-md copy --ignore "*.tmp" "temp/**"
```

------

#### 🔹 `directory`

Export to a **Markdown file** (default: `output.md`):

```bash
dir-to-md directory
```

With custom path:

```bash
dir-to-md directory --path notes.md
```

With custom ignores:

```bash
dir-to-md directory --path notes.md --ignore "*.log" "node_modules/"
```

------

#### 🔹 `ignore`

Manage persistent ignore rules stored in `ignore.json`.

Show current ignore patterns:

```bash
dir-to-md ignore --show
```

Add new patterns:

```bash
dir-to-md ignore --add "*.log" "dist/**"
```

Include specific files (override ignore):

```bash
dir-to-md ignore --add '!important.log'
```

Remove patterns:

```bash
dir-to-md ignore --remove "*.log"
```

> 💡 Tip: Wrap include patterns (those starting with `!`) in quotes to avoid shell issues.

------

### 🧰 Global Options

You can use `--ignore` with any command to apply **temporary** ignore rules:

```bash
dir-to-md directory --ignore "*.test.js" "coverage/**"
```

------

## 🎯 Ignore System Explained

This tool supports layered ignoring with the following priority:

1. **`.gitignore`** — automatically respected if found
2. **`ignore.json`** — persisted rules, editable via CLI
3. **`--ignore` CLI flag** — per-command override

### ✔ Supported Syntax

- Wildcards: `*.log`, `**/temp/*`, `?ile.txt`
- Negation: `!keep.md` to include ignored files
- Directory match: `node_modules/`, `dist/**`, `.git/`

------

## ✍️ Markdown Output Format

Each file is formatted as a Markdown snippet:

````md
# src/index.ts

\```ts
console.log('Hello World');
\```

# README.md

```md
# Project Title
```
---

## 🛠 Development

### 🔧 Available Scripts

```bash
npm run build    # Compile TypeScript
npm start        # Run built CLI locally
npm pack         # Bundle the CLI for distribution
```
````

------

## 🤝 Contributing

We welcome contributions!

1. Fork this repo
2. Create a new branch
3. Make your changes and commit
4. Open a pull request

> Bonus points for tests and useful examples 🙌

------

## 📄 License

This project is licensed under the **MIT License**.
 See the [LICENSE](https://github.com/behagoras/dir-to-md/blob/main/LICENSE) file for full details.