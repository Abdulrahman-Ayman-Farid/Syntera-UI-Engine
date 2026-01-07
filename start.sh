#!/bin/bash
set -e

# Configuration
TEMPLATES_DIR="/data/templates-repo"
GITHUB_REPO="${GITHUB_REPO:-https://github.com/Abdulrahman-Ayman-Farid/Syntera-UI-Engine.git}"
BRANCH="${GITHUB_BRANCH:-main}"
TOKEN="${GITHUB_TOKEN:-}"

echo "🚀 MCP Server Startup"
echo "===================================================="

# Create /data directory if it doesn't exist
mkdir -p /data
cd /data

# Clone or update templates repository
if [ ! -d "$TEMPLATES_DIR" ]; then
    echo "📥 Cloning templates repository..."
    if [ -n "$TOKEN" ]; then
        git clone "https://$TOKEN@github.com/Abdulrahman-Ayman-Farid/Syntera-UI-Engine.git" "$TEMPLATES_DIR"
    else
        git clone "$GITHUB_REPO" "$TEMPLATES_DIR"
    fi
    echo "✅ Repository cloned successfully"
else
    echo "📦 Repository exists. Pulling latest updates..."
    cd "$TEMPLATES_DIR"
    git fetch origin
    git reset --hard origin/$BRANCH
    git pull origin $BRANCH
    cd /data
    echo "✅ Repository updated to latest"
fi

echo "===================================================="
echo "📂 Templates available at: $TEMPLATES_DIR"
echo "📚 Template count: $(ls -1 "$TEMPLATES_DIR" 2>/dev/null | wc -l)"
echo "===================================================="

# Change to app directory
cd /app

# Start MCP server
echo "🔧 Starting MCP Server on port 3002..."
exec python mcp-server.py
