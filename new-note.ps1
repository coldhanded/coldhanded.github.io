param(
  [string]$Title
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($Title)) {
  $Title = Read-Host "Post title"
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

$notesDirectory = Join-Path $PSScriptRoot "src\content\philes\volume-1"
$postPath = Join-Path $notesDirectory "$slug.txt"

if (Test-Path $postPath) {
  throw "A post already exists at: $postPath"
}

$postDate = Get-Date -Format "yyyy-MM-dd"
$safeTitle = $Title.Replace('"', '\"')

$post = @"
---
title: "$safeTitle"
date: $postDate
author: "cold"
---

INTRODUCTION //

Write the article here.
"@

[System.IO.File]::WriteAllText(
  $postPath,
  $post + [Environment]::NewLine,
  [System.Text.UTF8Encoding]::new($false)
)

Write-Host "Created: $postPath"
& micro $postPath
