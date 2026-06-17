# Zelya -- Script de demarrage complet
# Usage : depuis la racine du projet, dans PowerShell :
#   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
#   .\start.ps1

$ErrorActionPreference = 'Stop'
$root  = $PSScriptRoot
$api   = Join-Path $root "apps\api"
$web   = Join-Path $root "apps\web"
$admin = Join-Path $root "apps\admin"

function Step($n, $total, $msg) {
    Write-Host ""
    Write-Host "[$n/$total] $msg" -ForegroundColor Yellow
}
function OK($msg)   { Write-Host "      OK -- $msg" -ForegroundColor Green }
function Info($msg) { Write-Host "      $msg"        -ForegroundColor Gray  }
function Err($msg)  { Write-Host "ERREUR : $msg"     -ForegroundColor Red   }

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "         ZELYA -- DEMARRAGE          " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# -- 0. Prerequis ---------------------------------------------------------------
Step 0 6 "Verification des prerequis..."

$dockerRunning = $false
try {
    $null = docker info 2>$null
    if ($LASTEXITCODE -eq 0) { $dockerRunning = $true }
} catch {}

if (-not $dockerRunning) {
    Info "Docker Desktop n est pas demarre -- tentative de lancement..."
    $dockerExe = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    if (Test-Path $dockerExe) {
        Start-Process $dockerExe
    } else {
        Err "Docker Desktop introuvable. Installez Docker Desktop depuis https://docs.docker.com/desktop/windows/"
        exit 1
    }
    Info "Attente du demarrage de Docker Desktop (jusqu a 90s)..."
    $waited = 0
    while ($waited -lt 90) {
        Start-Sleep 5
        $waited += 5
        try {
            $null = docker info 2>$null
            if ($LASTEXITCODE -eq 0) { $dockerRunning = $true; break }
        } catch {}
        Info "  [$waited/90s] En attente de Docker..."
    }
    if (-not $dockerRunning) {
        Err "Docker Desktop n a pas demarre apres 90s. Lancez-le manuellement et relancez ce script."
        exit 1
    }
}
OK "Docker Desktop en cours d execution"

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Err "Node.js introuvable. Installez Node.js 20+ et reessayez."
    exit 1
}
OK "Node.js $(node --version)"

# -- 1. Containers PostgreSQL + Redis -------------------------------------------
Step 1 6 "Demarrage PostgreSQL + Redis (Docker)..."

$ErrorActionPreference = 'Continue'
docker compose -f "$root\docker-compose.yml" up -d postgres redis
if ($LASTEXITCODE -ne 0) {
    Err "docker compose up a echoue."
    exit 1
}
$ErrorActionPreference = 'Stop'

Info "Attente de PostgreSQL (healthcheck)..."
$tries = 0
$maxTries = 30
$status = ""
while ($status -ne "healthy" -and $tries -lt $maxTries) {
    Start-Sleep 2
    $tries++
    try {
        $status = (docker inspect --format="{{.State.Health.Status}}" zelya_postgres 2>$null).Trim()
    } catch {
        $status = "starting"
    }
    Info "  [$tries/$maxTries] postgres : $status"
}

if ($status -ne "healthy") {
    Err "PostgreSQL n a pas demarre apres $($maxTries * 2)s."
    Info "Conseil : docker compose logs postgres"
    exit 1
}
OK "PostgreSQL pret"

# -- 2. Dependencies ------------------------------------------------------------
Step 2 6 "Installation des dependances manquantes..."

$ErrorActionPreference = 'Continue'
if (-not (Test-Path "$api\node_modules")) {
    Info "npm install apps/api..."
    Push-Location $api
    npm install --prefer-offline | Out-Null
    Pop-Location
    OK "apps/api installe"
}
if (-not (Test-Path "$web\node_modules")) {
    Info "npm install apps/web..."
    Push-Location $web
    npm install --prefer-offline | Out-Null
    Pop-Location
    OK "apps/web installe"
}
if (-not (Test-Path "$admin\node_modules")) {
    Info "npm install apps/admin..."
    Push-Location $admin
    npm install --prefer-offline | Out-Null
    Pop-Location
    OK "apps/admin installe"
}
$ErrorActionPreference = 'Stop'

# -- 3. Migrations Prisma -------------------------------------------------------
Step 3 6 "Migrations Prisma..."
Push-Location $api

$migrationsDir = Join-Path $api "prisma\migrations"
$ErrorActionPreference = 'Continue'
if (Test-Path $migrationsDir) {
    Info "Migrations existantes -> prisma migrate deploy"
    npx prisma migrate deploy
} else {
    Info "Premiere migration -> prisma migrate dev --name init"
    npx prisma migrate dev --name init
}
if ($LASTEXITCODE -ne 0) {
    Pop-Location
    Err "Migration Prisma echouee. Verifiez DATABASE_URL dans apps/api/.env"
    exit 1
}
$ErrorActionPreference = 'Stop'
Pop-Location
OK "Tables creees"

# -- 4. Seed --------------------------------------------------------------------
Step 4 6 "Injection des donnees de demo (100 profils)..."
Push-Location $api
$ErrorActionPreference = 'Continue'
npx prisma db seed
if ($LASTEXITCODE -ne 0) {
    Info "Seed echoue (peut-etre deja peuple -- on continue)"
}
$ErrorActionPreference = 'Stop'
Pop-Location
OK "Donnees de demo pretes"

# -- 5. API (nouveau terminal) --------------------------------------------------
Step 5 6 "Lancement API NestJS (nouveau terminal)..."
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Write-Host '=== ZELYA API ===' -ForegroundColor Cyan; Set-Location '$api'; npm run start:dev"
)

# -- 6. Web (nouveau terminal) --------------------------------------------------
Step 6 6 "Lancement Frontend React (nouveau terminal)..."
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Write-Host '=== ZELYA WEB ===' -ForegroundColor Cyan; Set-Location '$web'; npm run dev"
)

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "              ZELYA PRET -- LIENS UTILES             " -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "  Web      -->  http://localhost:5173                " -ForegroundColor White
Write-Host "  API Docs -->  http://localhost:3001/api/docs       " -ForegroundColor White
Write-Host "  Admin    -->  http://localhost:5174  (demarrer manuellement)" -ForegroundColor White
Write-Host "-----------------------------------------------------" -ForegroundColor DarkGray
Write-Host "  demo@zelya.demo   / Demo1234!   (visiteur)        " -ForegroundColor White
Write-Host "  admin@zelya.demo  / Admin1234!  (admin)           " -ForegroundColor White
Write-Host "-----------------------------------------------------" -ForegroundColor DarkGray
Write-Host "  Attendez ~15s que l API soit completement prete    " -ForegroundColor Gray
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""
