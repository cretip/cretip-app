#!/bin/bash

# Cretip App - Quick Start Script
# This script sets up and runs the entire local environment

set -e

echo "🚀 Cretip App - Local Environment Setup"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"
echo ""

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install from https://nodejs.org"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node --version)${NC}"

if ! command -v npm &> /dev/null; then
    echo "❌ npm not found."
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm --version)${NC}"

echo ""
echo -e "${BLUE}Installing dependencies...${NC}"
echo ""

# Backend setup
echo -e "${YELLOW}Setting up backend...${NC}"
cd backend
npm install
cd ..
echo -e "${GREEN}✓ Backend dependencies installed${NC}"
echo ""

# Frontend setup
echo -e "${YELLOW}Setting up frontend...${NC}"
cd frontend
npm install
cd ..
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
echo ""

# Summary
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "${BLUE}To start the application:${NC}"
echo ""
echo "Option 1: Run all services together:"
echo -e "  ${YELLOW}npm run dev${NC}"
echo ""
echo "Option 2: Run services separately:"
echo ""
echo "Terminal 1 - Backend:"
echo -e "  ${YELLOW}cd backend && npm run dev${NC}"
echo ""
echo "Terminal 2 - Frontend:"
echo -e "  ${YELLOW}cd frontend && npm run dev${NC}"
echo ""
echo -e "${BLUE}Then visit: http://localhost:3000${NC}"
echo ""
echo "For more details, see SETUP.md"
echo ""
