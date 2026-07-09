param(
  [string]$Title
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($Title)) {
  $Title = Read-Host "Project title"
}

if ([string]::IsNullOrWhiteSpace($Title)) {
  throw "A title is required."
}

$slug = $Title.ToLowerInvariant()
$slug = [regex]::Replace($slug, "[^a-z0-9]+", "-")
$slug = $slug.Trim("-")

if ([string]::IsNullOrWhiteSpace($slug)) {
  throw "Could not create a valid filename from the title."
}

$projectsDirectory = Join-Path $PSScriptRoot "src\content\philes\volume-0"

if (-not (Test-Path $projectsDirectory -PathType Container)) {
  throw "Projects directory does not exist: $projectsDirectory"
}

$postPath = Join-Path $projectsDirectory "$slug.txt"

if (Test-Path $postPath) {
  throw "A project already exists at: $postPath"
}

$orderValues = @()

Get-ChildItem -Path $projectsDirectory -Filter "*.txt" -File | ForEach-Object {
  $content = [System.IO.File]::ReadAllText($_.FullName)
  $orderMatch = [regex]::Match($content, "(?m)^order:\s*(\d+)\s*$")

  if (-not $orderMatch.Success) {
    throw "Could not find a valid order value in: $($_.FullName)"
  }

  $orderValues += [int]$orderMatch.Groups[1].Value
}

if ($orderValues.Count -eq 0) {
  $nextOrder = 0
} else {
  $nextOrder = [int](($orderValues | Measure-Object -Maximum).Maximum) + 1
}

$postDate = Get-Date -Format "yyyy-MM-dd"
$lastUpdated = (Get-Date).ToString(
  "MMMM yyyy",
  [System.Globalization.CultureInfo]::InvariantCulture
)
$safeTitle = $Title.Replace('"', '\"')

$post = @"
---
title: "$safeTitle"
date: $postDate
author: "cold"
order: $nextOrder
---

STATUS //

  Active

STACK //

  Add project stack here

LAST UPDATED //

  $lastUpdated

Write the project overview here.
"@

[System.IO.File]::WriteAllText(
  $postPath,
  $post + [Environment]::NewLine,
  [System.Text.UTF8Encoding]::new($false)
)

Write-Host "Created project $nextOrder`: $postPath"
& code --reuse-window $postPath