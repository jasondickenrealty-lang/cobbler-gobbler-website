#!/usr/bin/env pwsh
# Cobbler Gobbler Website - Automated Setup Script

Write-Host "Cobbler Gobbler Website Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Get script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "Working directory: $ScriptDir" -ForegroundColor Yellow
Write-Host ""

# Step 1: Check Node.js
Write-Host "Checking Node.js installation..." -ForegroundColor Green
try {
    $nodeVersion = node --version
    Write-Host "  Node.js version: $nodeVersion" -ForegroundColor Gray
} catch {
    Write-Host "Node.js is not installed!" -ForegroundColor Red
    Write-Host "  Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# Step 2: Install dependencies
Write-Host ""
Write-Host "Installing npm dependencies..." -ForegroundColor Green
Write-Host "  (This may take a few minutes)" -ForegroundColor Gray
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "npm install failed!" -ForegroundColor Red
    exit 1
}

Write-Host "  Dependencies installed successfully" -ForegroundColor Green

# Step 3: Create .env.local from template
Write-Host ""
Write-Host "Setting up environment file..." -ForegroundColor Green
if (Test-Path ".env.local") {
    Write-Host "  .env.local already exists, skipping..." -ForegroundColor Yellow
} else {
    Copy-Item ".env.example" ".env.local"
    Write-Host "  Created .env.local from template" -ForegroundColor Green
    Write-Host "  IMPORTANT: Edit .env.local with your Firebase credentials!" -ForegroundColor Yellow
}

# Step 4: Summary
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Edit .env.local with your Firebase credentials" -ForegroundColor White
Write-Host "  2. Run: npm run dev" -ForegroundColor White
Write-Host "  3. Visit: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Documentation:" -ForegroundColor Cyan
Write-Host "  • SETUP_COMPLETE.md - Complete overview" -ForegroundColor White
Write-Host "  • COMMANDS.md - Terminal commands" -ForegroundColor White
Write-Host "  • DEPLOYMENT.md - Deploy to Vercel" -ForegroundColor White
Write-Host ""
Write-Host "Ready to start? Run: npm run dev" -ForegroundColor Green
Write-Host ""
