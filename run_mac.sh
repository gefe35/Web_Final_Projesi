#!/bin/bash

echo "=========================================================="
echo "🚀 Bootstrapping Premium Blog Project (macOS M4 Edition) 🚀"
echo "=========================================================="

# Terminate background services cleanly on exit
cleanup() {
    echo ""
    echo "Stopping all background servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}
trap cleanup INT TERM EXIT

# 1. Boot Django Backend
echo "Starting Django REST Framework backend on http://localhost:8000..."
source backend/venv/bin/activate
python backend/manage.py runserver 8000 &
BACKEND_PID=$!

# Wait a brief moment for Django to initialize
sleep 2

# 2. Boot Angular Frontend
echo "Starting Angular SPA frontend on http://localhost:4200..."
cd frontend
npx ng serve &
FRONTEND_PID=$!

echo "=========================================================="
echo "🎯 Both services are booting successfully!"
echo "   - API Docs / Swagger: http://localhost:8000/api/docs/"
echo "   - Blog Web Application: http://localhost:4200/"
echo "=========================================================="
echo "Press Ctrl+C to safely shut down all services."

# Wait for both processes
wait
