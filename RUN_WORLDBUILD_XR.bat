```bat
@echo off
setlocal EnableExtensions
title WORLDBUILD XR - Setup and Run
color 0B
cd /d "%~dp0"

echo.
echo ================================================
echo         WORLDBUILD XR - AUTO SETUP
echo ================================================
echo.

if not exist "package.json" (
    echo ERROR: package.json not found.
    echo Put this BAT file in your project root folder.
    goto FAILED
)

where node >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is missing.
    echo Install it from https://nodejs.org/
    goto FAILED
)

where npm >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is missing.
    goto FAILED
)

echo Node:
node --version
echo npm:
call npm --version
echo.

echo [1/4] Installing project dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed.
    goto FAILED
)

echo.
echo [2/4] Ensuring required packages are installed...
call npm install --save-dev vite typescript @vitejs/plugin-react
if errorlevel 1 (
    echo ERROR: Development package installation failed.
    goto FAILED
)

echo.
echo [3/4] Checking TypeScript and building the project...
call npm run build
if errorlevel 1 (
    echo.
    echo ERROR: Build failed.
    echo Fix the TypeScript or source-code errors shown above.
    goto FAILED
)

echo.
echo [4/4] Starting WORLDBUILD XR...
echo.
echo Open: http://127.0.0.1:5173
echo Keep this terminal open while using the app.
echo Press Ctrl+C to stop the server.
echo.

start "" cmd /c "timeout /t 3 /nobreak >nul & start http://127.0.0.1:5173"

call npm run dev -- --host 127.0.0.1

echo.
echo The development server has stopped.
goto END

:FAILED
echo.
echo ================================================
echo SETUP OR BUILD FAILED
echo Read the error messages above this line.
echo ================================================

:END
echo.
pause
endlocal
```