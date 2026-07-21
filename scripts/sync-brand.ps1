# sync-brand.ps1 - re-copy the vendored brand tokens into src/assets/.
#
# The site vendors three files from its OWN brand/dist build so the token CSS
# ships with the site (no cross-repo build dependency). Edit brand/tokens.json,
# rebuild with `onbrand build .`, then run this to pull the fresh copies into
# src/assets/, review the diff, and commit + push.
#
# Usage (from the repo root in Windows PowerShell):  .\scripts\sync-brand.ps1
# ASCII-only, no smart quotes / em-dashes (Windows no-BOM .ps1 rule).

$ErrorActionPreference = "Stop"

# Resolve paths relative to this script so cwd does not matter.
$repoRoot = Split-Path -Parent $PSScriptRoot
$srcDir = Join-Path $repoRoot "brand\dist"
$dstDir = Join-Path $repoRoot "src\assets"
$files = @("tokens.css", "theme.tw.css", "diagram-palette.json")

if (-not (Test-Path $srcDir)) {
    throw "Brand source not found: $srcDir (run 'onbrand build .' from the repo root to generate brand/dist first)."
}
if (-not (Test-Path $dstDir)) {
    throw "Destination not found: $dstDir (expected src/assets/ in this repo)."
}

foreach ($f in $files) {
    $from = Join-Path $srcDir $f
    if (-not (Test-Path $from)) { throw "Missing brand source file: $from" }
    Copy-Item -LiteralPath $from -Destination (Join-Path $dstDir $f) -Force
    Write-Host "synced $f"
}

Write-Host "Brand tokens re-synced into src/assets/. Review the diff, then commit + push."
