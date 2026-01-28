@echo off
REM YouTube Frame Capture - Windows Run Script
REM This script starts a local web server for the application

echo.
echo ========================================
echo   YouTube Frame Capture - Launcher
echo ========================================
echo.

REM Check if youtube-frame-capture directory exists
if not exist "youtube-frame-capture" (
    echo [ERROR] youtube-frame-capture directory not found!
    echo         Make sure you're in the project root directory.
    echo.
    pause
    exit /b 1
)

REM Navigate to the application directory
cd youtube-frame-capture

echo [INFO] Looking for available web server...
echo.

REM Check for Python 3
where python3 >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Found Python 3
    echo [INFO] Starting server on http://localhost:8000
    echo.
    echo Press Ctrl+C to stop the server
    echo Open your browser and navigate to: http://localhost:8000
    echo.
    python3 -m http.server 8000
    exit /b 0
)

REM Check for Python
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Found Python
    echo [INFO] Starting server on http://localhost:8000
    echo.
    echo Press Ctrl+C to stop the server
    echo Open your browser and navigate to: http://localhost:8000
    echo.
    python -m http.server 8000
    exit /b 0
)

REM Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Found Node.js
    echo [INFO] Starting server on http://localhost:8000
    echo.
    echo Press Ctrl+C to stop the server
    echo Open your browser and navigate to: http://localhost:8000
    echo.
    npx http-server -p 8000
    exit /b 0
)

REM Check for PHP
where php >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Found PHP
    echo [INFO] Starting server on http://localhost:8000
    echo.
    echo Press Ctrl+C to stop the server
    echo Open your browser and navigate to: http://localhost:8000
    echo.
    php -S localhost:8000
    exit /b 0
)

REM No server found
echo [ERROR] No web server found!
echo.
echo Please install one of the following:
echo   - Python: https://www.python.org/downloads/
echo   - Node.js: https://nodejs.org/
echo   - PHP: https://www.php.net/
echo.
echo Then run this script again.
echo.
pause
exit /b 1
