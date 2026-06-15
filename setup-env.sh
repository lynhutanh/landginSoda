#!/bin/bash

# ===========================================
# Base Code - Environment Setup Script
# ===========================================
# This script creates .env files for all projects
# from the example files in the env folder
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
echo -e "${BLUE}   Base Code - Environment Setup${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Function to copy env file
copy_env_file() {
    local source=$1
    local dest=$2
    local name=$3

    if [ -f "$source" ]; then
        if [ -f "$dest" ]; then
            echo -e "${YELLOW}⚠ $name: .env file already exists${NC}"
            read -p "   Do you want to overwrite? (y/N): " -n 1 -r
            echo ""
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                cp "$source" "$dest"
                echo -e "${GREEN}✓ $name: .env file overwritten${NC}"
            else
                echo -e "${YELLOW}  Skipped $name${NC}"
            fi
        else
            cp "$source" "$dest"
            echo -e "${GREEN}✓ $name: .env file created${NC}"
        fi
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
echo -e "${BLUE}Next steps:${NC}"
echo -e "  1. cd api && yarn install && yarn dev"
echo -e "  2. cd admin && yarn install && yarn dev"
echo -e "  3. cd user && yarn install && yarn dev"
echo ""

