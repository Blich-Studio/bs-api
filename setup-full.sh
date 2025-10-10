#!/usr/bin/env bash
set -u  # fail on undefined vars, but not on normal command errors

echo "🚀 Starting full setup..."

# -----------------------------------------------------------------------------
# Helper: Run a command with retry
# -----------------------------------------------------------------------------
run_with_retry() {
  local cmd="$1"
  local retries=3
  local count=0

  until $cmd; do
    count=$((count + 1))
    echo "⚠️  Attempt $count failed for: $cmd"
    if [ $count -ge $retries ]; then
      echo "❌ Failed after $retries attempts. Skipping this step."
      return 1
    fi
    echo "🔁 Retrying in 2s..."
    sleep 2
  done
  return 0
}

# -----------------------------------------------------------------------------
# 1️⃣ Clean old configs
# -----------------------------------------------------------------------------
echo "🧹 Cleaning old config files..."
rm -rf node_modules bun.lockb .husky .vscode/dist .cache || true

# -----------------------------------------------------------------------------
# 2️⃣ Backup package.json
# -----------------------------------------------------------------------------
if [ -f package.json ]; then
  echo "💾 Backing up package.json..."
  cp package.json package.backup.json
fi

# -----------------------------------------------------------------------------
# 3️⃣ Install dependencies (with auto-retry)
# -----------------------------------------------------------------------------
echo "📦 Installing dev dependencies with Bun..."
rm -rf node_modules bun.lockb

install_cmd="bun add -d eslint prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin \
  eslint-plugin-import eslint-plugin-prettier eslint-config-prettier \
  husky lint-staged @commitlint/cli @commitlint/config-conventional \
  standard-version@9.5.0"

if ! run_with_retry "$install_cmd"; then
  echo "⚠️  Retrying clean Bun install as fallback..."
  rm -rf node_modules bun.lockb
  run_with_retry "bun install" || {
    echo "❌ Bun installation failed completely. Please check your Bun setup."
    exit 1
  }
fi

# Remove broken deps like contextify
bun remove contextify >/dev/null 2>&1 || true
echo "✅ Dependencies installed successfully!"

# -----------------------------------------------------------------------------
# 4️⃣ Setup Husky (idempotent)
# -----------------------------------------------------------------------------
if [ ! -d ".husky" ]; then
  echo "🐶 Setting up Husky..."
  bunx husky-init --yes
  echo "npx lint-staged" > .husky/pre-commit
else
  echo "🐶 Husky already set up, skipping."
fi

# -----------------------------------------------------------------------------
# 5️⃣ Lint-staged & Commitlint
# -----------------------------------------------------------------------------
echo "🧩 Creating lint-staged and commitlint config..."
cat > .lintstagedrc.json <<'EOF'
{
  "*.{js,ts,scss,css,md,json}": [
    "eslint --fix",
    "prettier --write"
  ]
}
EOF

cat > commitlint.config.js <<'EOF'
export default {
  extends: ['@commitlint/config-conventional']
};
EOF

# -----------------------------------------------------------------------------
# 6️⃣ VSCode settings
# -----------------------------------------------------------------------------
mkdir -p .vscode
echo "🧠 Configuring VSCode settings..."
cat > .vscode/settings.json <<'EOF'
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": ["javascript", "typescript"],
  "files.eol": "\n",
  "prettier.singleQuote": true,
  "prettier.semi": true,
  "prettier.trailingComma": "es5"
}
EOF

# -----------------------------------------------------------------------------
# 7️⃣ Git init
# -----------------------------------------------------------------------------
if [ ! -d ".git" ]; then
  echo "📘 Initializing Git repository..."
  git init
  git add .
  git commit -m "chore: initial setup"
else
  echo "📘 Git already initialized, skipping."
fi

# -----------------------------------------------------------------------------
# ✅ Done
# -----------------------------------------------------------------------------
echo ""
echo "✨ Setup complete!"
echo "Next steps:"
echo "  • Run: bun dev           # start dev server"
echo "  • Run: bun lint          # lint code"
echo "  • Run: bun run release   # create versioned release"
echo ""
echo "💡 You can safely re-run this script anytime."
