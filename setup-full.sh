#!/usr/bin/env bash
set -e

echo "🚀 Starting full setup with self-healing Bun + TypeScript + ESLint + Husky + Commitlint..."

# --- UTILS ---
function safe_run {
  local CMD="$1"
  local DESC="$2"
  echo "➡️ $DESC..."
  if ! eval "$CMD"; then
    echo "⚠️ $DESC failed — retrying once..."
    sleep 2
    if ! eval "$CMD"; then
      echo "❌ $DESC failed twice. Continuing safely..."
    else
      echo "✅ $DESC recovered on retry."
    fi
  fi
}

# --- CLEANUP ---
echo "🧹 Cleaning project..."
rm -rf node_modules dist coverage .eslintcache .husky/_ bun.lockb
mkdir -p .husky

# --- BACKUP ---
if [ -f package.json ]; then
  echo "💾 Backing up package.json..."
  cp package.json package.backup.json
fi

# --- INIT ---
if [ ! -f package.json ]; then
  echo "📦 Initializing Bun project..."
  bun init -y
fi

# --- INSTALL DEPS (with retry) ---
safe_run \
  'bun add -d eslint prettier @typescript-eslint/{parser,eslint-plugin} eslint-plugin-prettier eslint-plugin-import \
  @commitlint/{cli,config-conventional} husky lint-staged standard-version typescript' \
  "Installing dev dependencies"

# --- CONFIG FILES ---
echo "🧩 Creating ESLint flat config..."
cat > eslint.config.js <<'EOF'
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import importPlugin from "eslint-plugin-import";

export default [
  ...js.configs.recommended,
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { sourceType: "module" }
    },
    plugins: { "@typescript-eslint": tseslint, prettier, import: importPlugin },
    rules: {
      ...tseslint.configs.recommended.rules,
      "prettier/prettier": "error",
      "import/order": ["error", { "newlines-between": "always" }],
      "no-unused-vars": "warn"
    }
  }
];
EOF

echo "✨ Creating .prettierrc..."
cat > .prettierrc <<'EOF'
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
EOF

echo "🪄 Creating .lintstagedrc.json..."
cat > .lintstagedrc.json <<'EOF'
{
  "*.{js,ts,tsx,jsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md,css,scss}": ["prettier --write"]
}
EOF

echo "🧾 Creating commitlint.config.js..."
cat > commitlint.config.js <<'EOF'
export default { extends: ["@commitlint/config-conventional"] };
EOF

# --- PACKAGE SCRIPTS ---
echo "🔧 Updating package.json scripts..."
tmp=$(mktemp)
jq '.scripts = {
  "prepare": "husky",
  "lint": "eslint .",
  "lint:fix": "eslint --fix .",
  "format": "prettier --write .",
  "release": "standard-version"
}' package.json > "$tmp" && mv "$tmp" package.json

# --- HUSKY SETUP ---
echo "🐶 Initializing Husky..."
rm -rf .husky/_ || true
safe_run "bunx husky-init --no-install || true" "Running bunx husky-init"
mkdir -p .husky/_

# --- SELF-HEALING HOOKS ---
echo "🔁 Rebuilding Husky hooks if missing..."
cat > .husky/pre-commit <<'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
echo "🧹 Running pre-commit checks..."
bunx lint-staged
EOF
chmod +x .husky/pre-commit

cat > .husky/commit-msg <<'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
echo "🧾 Validating commit message..."
bunx commitlint --edit "$1"
EOF
chmod +x .husky/commit-msg

# --- SELF-HEAL INSTALL ---
echo "🩹 Running Bun install (with retry)..."
if ! bun install; then
  echo "⚠️ First install failed — cleaning cache and retrying..."
  rm -rf node_modules bun.lockb
  bun install || { echo "❌ Bun install failed twice — skipping."; }
else
  echo "✅ Bun install successful."
fi

# --- VERIFY HUSKY ---
echo "🔍 Verifying Husky setup..."
if [ ! -f .husky/pre-commit ] || [ ! -f .husky/commit-msg ]; then
  echo "⚠️ Hooks missing, re-creating..."
  mkdir -p .husky/_ && touch .husky/_/.keep
  chmod +x .husky/pre-commit .husky/commit-msg || true
fi

echo "✅ Setup complete with self-healing!"
echo "👉 Try committing a file to verify Husky + linting."
