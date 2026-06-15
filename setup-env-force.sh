#!/bin/bash

# ===========================================
# Base Code - Force Environment Setup Script
# ===========================================
# This script creates .env files for all projects
# WITHOUT asking for confirmation (overwrites existing)
# ===========================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}   Base Code - Force Environment Setup${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Function to copy env file (force overwrite)
copy_env_file() {
    local source=$1
    local dest=$2
    local name=$3

    if [ -f "$source" ]; then
        cp "$source" "$dest"
        echo -e "${GREEN}✓ $name: .env file created/overwritten${NC}"
    else
        echo -e "${RED}✗ $name: Example file not found at $source${NC}"
    fi
}

# Setup API environment
echo -e "\n${BLUE}Setting up API environment...${NC}"
copy_env_file "$SCRIPT_DIR/env/api.env.example" "$SCRIPT_DIR/api/.env" "API"

# Setup Admin environment
echo -e "\n${BLUE}Setting up Admin environment...${NC}"
copy_env_file "$SCRIPT_DIR/env/admin.env.example" "$SCRIPT_DIR/admin/.env" "Admin"

# Setup User environment
echo -e "\n${BLUE}Setting up User environment...${NC}"
copy_env_file "$SCRIPT_DIR/env/user.env.example" "$SCRIPT_DIR/user/.env" "User"

echo ""
echo -e "${BLUE}================================================${NC}"
echo -e "${GREEN}Environment setup completed!${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""
echo -e "${YELLOW}Important:${NC}"
echo -e "  1. Review and update the .env files with your actual values"
echo -e "  2. Never commit .env files to version control"
echo -e "  3. Change all secret keys in production"
echo ""

