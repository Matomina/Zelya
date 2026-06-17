# Zelya -- Reinitialisation des donnees de demo (100 profils)
# Usage : depuis la racine du projet
#   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
#   .\reseed.ps1
#
# Ce script supprime toutes les donnees et reinjecte les 100 profils de demo.
# La base de donnees doit deja tourner (docker compose up postgres).

$ErrorActionPreference = 'Continue'
$api = Join-Path $PSScriptRoot "apps\api"

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "  ZELYA -- RESEED 100 PROFILS  " -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Cette operation va supprimer toutes les donnees existantes et reinjecter" -ForegroundColor Yellow
Write-Host "les 100 profils fictifs de demo avec les photos portrait." -ForegroundColor Yellow
Write-Host ""

Push-Location $api

Write-Host "[1/2] Reset de la base (suppression + migration + seed)..." -ForegroundColor Yellow
npx prisma migrate reset --force

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERREUR : La reinitialisation a echoue." -ForegroundColor Red
    Write-Host "Verifiez que PostgreSQL tourne (docker compose up -d postgres redis)" -ForegroundColor Red
    Pop-Location
    exit 1
}

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "  RESEED TERMINE AVEC SUCCES   " -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "  100 profils injectes avec photos portrait (randomuser.me)" -ForegroundColor White
Write-Host "  Visiteur : demo@zelya.demo   / Demo1234!" -ForegroundColor White
Write-Host "  Admin    : admin@zelya.demo  / Admin1234!" -ForegroundColor White
Write-Host ""
Write-Host "  Relancez l API si elle tourne deja pour voir les changements." -ForegroundColor Gray
Write-Host ""

Pop-Location
