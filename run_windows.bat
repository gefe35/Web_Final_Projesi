@echo off
title Bootstrapping Premium Blog Project (Windows Edition)
echo ==========================================================
echo   Bootstrapping Premium Blog Project (Windows Edition)
echo ==========================================================

:: 1. Boot Django Backend in a separate cmd window
echo [Backend] Booting Django REST Framework backend on http://localhost:8000...
start "Django API Server (Port 8000)" cmd /k "cd backend && venv\Scripts\activate && python manage.py runserver 8000"

:: Wait a moment
timeout /t 3 /nobreak >nul

:: 2. Boot Angular Frontend in a separate cmd window
echo [Frontend] Booting Angular SPA frontend on http://localhost:4200...
start "Angular Dev Server (Port 4200)" cmd /k "cd frontend && npx ng serve"

echo ==========================================================
echo   Both windows have been launched!
echo   - Backend & Swagger: http://localhost:8000/api/docs/
echo   - Frontend: http://localhost:4200/
echo ==========================================================
echo Close the popped-up terminal prompts to stop the servers.
pause
