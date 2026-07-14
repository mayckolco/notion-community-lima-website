# Sync .env variables to Vercel production (non-interactive).
# Usage: pwsh scripts/sync-vercel-env.ps1

$ErrorActionPreference = "Stop"

if (-not (Test-Path ".env")) {
  Write-Error ".env not found in repo root"
}

Get-Content ".env" | ForEach-Object {
  $line = $_.Trim()
  if ($line -eq "" -or $line.StartsWith("#")) { return }

  $idx = $line.IndexOf("=")
  if ($idx -lt 1) { return }

  $name = $line.Substring(0, $idx).Trim()
  $value = $line.Substring($idx + 1).Trim()
  if ($value.StartsWith('"') -and $value.EndsWith('"')) {
    $value = $value.Substring(1, $value.Length - 2)
  }

  if ($name -eq "" -or $value -eq "") { return }

  Write-Host "Syncing $name ..."
  $value | vercel env add $name production --force 2>&1 | Out-Host
}

Write-Host "Done. Run: vercel --prod"
