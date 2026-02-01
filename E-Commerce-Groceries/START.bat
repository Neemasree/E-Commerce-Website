@echo off
echo ========================================
echo   FreshMart Groceries - Quick Start
echo ========================================
echo.

echo [1/4] Checking MongoDB...
echo Please make sure MongoDB is running!
echo.
pause

echo [2/4] Starting Backend Server...
cd backend
start cmd /k "npm run dev"
timeout /t 3

echo [3/4] Starting Frontend Server...
cd ..\frontend
start cmd /k "npm run dev"
timeout /t 3

echo [4/4] Opening Browser...
timeout /t 5
start http://localhost:5173

echo.
echo ========================================
echo   Application Started Successfully!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Demo Login:
echo Email: demo@freshmart.com
echo Password: demo123
echo.
pause