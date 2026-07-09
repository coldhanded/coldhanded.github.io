[CmdletBinding()]
param(
  [Parameter(Position = 0, ValueFromRemainingArguments = $true)]
  [string[]] $Message
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

function Assert-Success {
  param([string] $Step)

  if ($LASTEXITCODE -ne 0) {
    throw "$Step failed with exit code $LASTEXITCODE."
  }
}

$branch = (git branch --show-current).Trim()
Assert-Success "Reading the current branch"

if ($branch -ne "main") {
  throw "Publishing is only allowed from main. Current branch: $branch"
}

git fetch origin main --quiet
Assert-Success "Checking the remote repository"

$behind = [int](git rev-list --count HEAD..origin/main)
Assert-Success "Comparing local and remote history"

if ($behind -gt 0) {
  throw "The remote repository has newer commits. Pull them before publishing."
}

$changes = @(git status --short)
Assert-Success "Reading Git status"

if ($changes.Count -eq 0) {
  Write-Host "Nothing to publish."
  exit 0
}

Write-Host ""
Write-Host "Changes to publish:"
$changes | ForEach-Object { Write-Host "  $_" }
Write-Host ""

$confirmation = Read-Host "Build and publish these changes? [y/N]"
if ($confirmation -notmatch "^(?i:y|yes)$") {
  Write-Host "Canceled."
  exit 0
}

corepack pnpm build
Assert-Success "Production build"

git add --all
Assert-Success "Staging changes"

if ($Message.Count -gt 0) {
  $commitMessage = $Message -join " "
} else {
  $commitMessage = Read-Host "Commit message"
}

if ([string]::IsNullOrWhiteSpace($commitMessage)) {
  throw "A commit message is required."
}

git commit -m $commitMessage
Assert-Success "Creating the commit"

git push origin main
Assert-Success "Pushing to GitHub"

Write-Host ""
Write-Host "Published successfully."
