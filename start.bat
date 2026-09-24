@echo off
title TRAANA Emergency Network Launcher
echo =================================================================
echo   TRAANA - Threat Response ^& Assistance Network for Alerts ^& Navigation
echo   Initializing MVP Backend and Frontend Systems...
echo =================================================================

cd /d "%~dp0"

echo [1/3] Starting Backend API (Port 5000)...
start "TRAANA Backend Server" cmd /k "cd /d ""%~dp0backend"" && npm start"

echo [2/3] Starting Frontend Web App (Port 3000)...
start "TRAANA Frontend Application" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

echo [3/3] Waiting for servers to initialize...
timeout /t 4 /nobreak >nul

echo.
echo Opening TRAANA in your browser...
start http://localhost:3000

echo.
echo =================================================================
echo   TRAANA is now running!
echo   Frontend UI: http://localhost:3000
echo   Backend API: http://localhost:5000
echo =================================================================
echo.
pause
