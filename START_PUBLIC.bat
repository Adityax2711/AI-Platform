@echo off
title HireAI — Public URL Launcher
color 0B

echo.
echo  ████████████████████████████████████████████
echo  █                                          █
echo  █     HireAI — Public URL Launcher         █
echo  █                                          █
echo  ████████████████████████████████████████████
echo.

set NGROK="%~dp0ngrok.exe"
set APP="%~dp0app.py"

:: ── Check files exist ──
if not exist %NGROK% (
    echo  [ERROR] ngrok.exe not found in this folder.
    echo  Please place ngrok.exe here: %~dp0
    pause & exit /b 1
)
if not exist %APP% (
    echo  [ERROR] app.py not found!
    pause & exit /b 1
)

:: ── Ask for auth token if not configured ──
echo  [1/3] Configuring ngrok auth token...
set /p TOKEN="  Paste your ngrok authtoken (from dashboard.ngrok.com): "
%NGROK% config add-authtoken %TOKEN%
echo.

:: ── Start Flask ──
echo  [2/3] Starting Flask server on port 5000...
start /min cmd /c "python "%~dp0app.py""
timeout /t 2 /nobreak > nul
echo        Flask started!
echo.

:: ── Start ngrok ──
echo  [3/3] Starting ngrok tunnel...
start /min %NGROK% http 5000
timeout /t 4 /nobreak > nul

:: ── Fetch URL from ngrok API ──
echo  Fetching your public URL...
for /f "tokens=*" %%a in ('powershell -Command "(Invoke-RestMethod http://127.0.0.1:4040/api/tunnels).tunnels | Where-Object {$_.proto -eq 'https'} | Select-Object -ExpandProperty public_url"') do set PUBLIC_URL=%%a

echo.
if defined PUBLIC_URL (
    echo  ╔══════════════════════════════════════════════════════╗
    echo  ║                                                      ║
    echo  ║   YOUR PUBLIC URL IS:                                ║
    echo  ║                                                      ║
    echo  ║   %PUBLIC_URL%
    echo  ║                                                      ║
    echo  ║   Share this with anyone — works in any browser!     ║
    echo  ╚══════════════════════════════════════════════════════╝
    echo.
    :: Copy to clipboard
    echo %PUBLIC_URL% | clip
    echo  [Copied to clipboard!]
    :: Open in browser
    start "" "%PUBLIC_URL%"
    echo  [Opened in your browser!]
) else (
    echo  Could not auto-detect URL.
    echo  Open http://127.0.0.1:4040 in your browser to find it.
)

echo.
echo  ngrok dashboard: http://127.0.0.1:4040
echo  Local:           http://127.0.0.1:5000
echo.
echo  Keep this window open to stay online.
echo  Press Ctrl+C or close to shut down.
echo.
pause
