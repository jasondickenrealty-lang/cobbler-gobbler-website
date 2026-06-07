param(
  [string]$ProjectName = "",
  [string]$Domain = "cobblestonepos.com",
  [string]$WwwDomain = "",
  [switch]$SkipBuild,
  [switch]$SkipDeploy,
  [switch]$SkipDomains
)

$ErrorActionPreference = "Stop"

$siteRoot = Split-Path -Parent $PSScriptRoot
$vercelProjectPath = Join-Path $siteRoot ".vercel\project.json"

function Require-Command($Name) {
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Required command '$Name' was not found. Install it before running this script."
  }
}

function Invoke-VercelCli {
  param([string[]]$Arguments)

  $argsForDisplay = $Arguments -join " "
  Write-Host "Running: vercel $argsForDisplay" -ForegroundColor Cyan
  & vercel @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "Vercel CLI command failed: vercel $argsForDisplay"
  }
}

Require-Command "npm"
Require-Command "vercel"

if (-not $WwwDomain) {
  $WwwDomain = "www.$Domain"
}

if (-not (Test-Path $vercelProjectPath)) {
  throw "Missing .vercel/project.json. Run 'vercel link' from $siteRoot first."
}

$project = Get-Content $vercelProjectPath -Raw | ConvertFrom-Json
$projectId = $project.projectId
$teamId = $project.orgId
$currentProjectName = $project.projectName

if (-not $projectId) {
  throw "Could not read projectId from $vercelProjectPath."
}

if (-not $ProjectName) {
  $ProjectName = $currentProjectName
}

Push-Location $siteRoot
try {
  Write-Host "Website root: $siteRoot"
  Write-Host "Current linked Vercel project: $currentProjectName ($projectId)"
  Write-Host "Target Vercel project name: $ProjectName"
  Write-Host "Target domains: $Domain, $WwwDomain"

  if (-not $SkipBuild) {
    npm run check:prod
  }

  if (-not $SkipDeploy) {
    Invoke-VercelCli -Arguments @("deploy", "--prod")
  }

  if (-not $SkipDomains) {
    Invoke-VercelCli -Arguments @("domains", "add", $Domain, $ProjectName)
    Invoke-VercelCli -Arguments @("domains", "add", $WwwDomain, $ProjectName)
    Invoke-VercelCli -Arguments @("domains", "inspect", $Domain)
    Invoke-VercelCli -Arguments @("domains", "inspect", $WwwDomain)
  }

  Write-Host ""
  Write-Host "Add the DNS records Vercel reports above at your domain registrar." -ForegroundColor Yellow
  Write-Host "Typical records are:"
  Write-Host "  A     @      76.76.21.21"
  Write-Host "  CNAME www    cname.vercel-dns.com"
} finally {
  Pop-Location
}