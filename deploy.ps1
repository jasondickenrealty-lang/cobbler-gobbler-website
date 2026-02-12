#!/usr/bin/env pwsh
# Cobbler Gobbler Website - Deployment Script

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Deployment Configuration Check" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

# Check .env.local
Write-Host "Checking .env.local..." -ForegroundColor Green
if (-not (Test-Path ".env.local")) {
    Write-Host "ERROR: .env.local not found!" -ForegroundColor Red
    Write-Host "Please create .env.local with your Firebase credentials:" -ForegroundColor Yellow
    Write-Host "  1. Copy .env.example to .env.local" -ForegroundColor White
    Write-Host "  2. Add your Firebase config values" -ForegroundColor White
    Write-Host "  3. Run this script again" -ForegroundColor White
    exit 1
}

$envContent = (Get-Content ".env.local" | Out-String)
$missingVars = @()

@("NEXT_PUBLIC_FIREBASE_API_KEY", "NEXT_PUBLIC_FIREBASE_PROJECT_ID", "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN") | ForEach-Object {
    $varName = $_
    if ($envContent -notmatch [regex]::Escape($varName)) {
        $missingVars += $_
    }
}

if ($missingVars.Count -gt 0) {
    Write-Host "WARNING: Missing Firebase config:" -ForegroundColor Yellow
    $missingVars | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
    Write-Host "Please add these to .env.local before deploying" -ForegroundColor Yellow
    exit 1
}

Write-Host "  .env.local is configured" -ForegroundColor Green
Write-Host ""

# Check Firebase CLI
Write-Host "Checking Firebase CLI..." -ForegroundColor Green
try {
    $firebaseVersion = firebase --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  Firebase CLI installed: $firebaseVersion" -ForegroundColor Gray
    } else {
        throw "Not installed"
    }
} catch {
    Write-Host "Installing Firebase CLI..." -ForegroundColor Yellow
    npm install -g firebase-tools
}

Write-Host ""

# Check Vercel CLI
Write-Host "Checking Vercel CLI..." -ForegroundColor Green
try {
    $vercelVersion = vercel --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  Vercel CLI installed: $vercelVersion" -ForegroundColor Gray
    } else {
        throw "Not installed"
    }
} catch {
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Deploying to Vercel" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "NOTE: First deployment requires authentication" -ForegroundColor Yellow
Write-Host "You will be prompted to log in to Vercel" -ForegroundColor Yellow
Write-Host ""

# Deploy to Vercel
Write-Host "Running: vercel --prod" -ForegroundColor Cyan
vercel --prod

if ($LASTEXITCODE -ne 0) {
    Write-Host "Vercel deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Green
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your website is now live!" -ForegroundColor Green
Write-Host ""
Write-Host "Next: Add environment variables in Vercel Dashboard" -ForegroundColor Cyan
Write-Host "  1. Go to https://vercel.com/dashboard" -ForegroundColor White
Write-Host "  2. Select your project" -ForegroundColor White
Write-Host "  3. Settings > Environment Variables" -ForegroundColor White
Write-Host "  4. Add all NEXT_PUBLIC_FIREBASE_* variables" -ForegroundColor White
Write-Host "  5. Redeploy" -ForegroundColor White
Write-Host ""
