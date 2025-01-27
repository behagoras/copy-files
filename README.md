# copy-files

A simple TypeScript package that copies files and folders while respecting `.gitignore` rules.

## Installation

```bash
npm install copy-files
```

## Global Installation with npm pack

To install the package globally and use it as a command-line tool:

1. Navigate to the project directory:

   ```bash
   cd /path/to/copy-files
   ```

2. Build the project:

   ```bash
   npm run build
   ```

3. Create a tarball using npm pack:

   ```bash
   npm pack
   ```

   This will generate a file like `copy-files-1.0.0.tgz`.

4. Install the package globally:

   ```bash
   npm install -g ./copy-files-1.0.0.tgz
   ```

## Usage

Once installed globally, you can use the command in any directory:

```bash
copy-files
```

This will:

- Copy all files and folders from the current directory to a new folder named `copied`.
- Ignore files and folders specified in `.gitignore`.
- Generate a Markdown file `output.md` containing the contents of copied files.

## Development and Contribution

To contribute to this project:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/copy-files.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the project locally:

   ```bash
   npm start
   ```

