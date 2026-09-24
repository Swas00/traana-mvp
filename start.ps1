# TRAANA Launcher Script for PowerShell
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host " TRAANA - Threat Response & Assistance Network for Alerts & Navigation" -ForegroundColor Yellow
Write-Host " Launching Fullstack MVP Prototype..." -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

$rootPath = $PSScriptRoot
$backendPath = Join-Path $rootPath "backend"
$frontendPath = Join-Path $rootPath "frontend"

Write-Host "`n[1/3] Starting Backend API Server (Port 5000)..." -ForegroundColor White
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendPath'; npm start"

Write-Host "[2/3] Starting Frontend Vite App (Port 3000)..." -ForegroundColor White
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendPath'; npm run dev"

Write-Host "[3/3] Initializing connections..." -ForegroundColor White
Start-Sleep -Seconds 4

Write-Host "`nOpening http://localhost:3000 in your browser..." -ForegroundColor Green
Start-Process "http://localhost:3000"

Write-Host "`n=================================================================" -ForegroundColor Cyan
Write-Host " TRAANA services running successfully:" -ForegroundColor Green
Write-Host " -> Backend API:  http://localhost:5000" -ForegroundColor White
Write-Host " -> Frontend App: http://localhost:3000" -ForegroundColor White
Write-Host "=================================================================" -ForegroundColor Cyan
