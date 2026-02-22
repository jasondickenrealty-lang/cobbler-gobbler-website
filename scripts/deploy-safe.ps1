Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Write-Host "Building website..." -ForegroundColor Cyan
npm run check:prod

Write-Host ""
Write-Host "Build succeeded." -ForegroundColor Green
Write-Host "This deployment will count against your Vercel daily limit." -ForegroundColor Yellow

$response = Read-Host "Deploy to Vercel production now? (y/N)"
if ($response -notmatch '^(y|yes)$') {
  Write-Host "Deployment canceled." -ForegroundColor Yellow
  exit 0
}

Write-Host "Deploying to Vercel production..." -ForegroundColor Cyan
npx vercel --prod --yes