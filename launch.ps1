# ═══════════════════════════════════════════════════════════════════
#  HireAI — Launch Script
#  Starts Flask server + ngrok tunnel and prints the public URL
# ═══════════════════════════════════════════════════════════════════

Write-Host ""
Write-Host "  ██╗  ██╗██╗██████╗ ███████╗ █████╗ ██╗" -ForegroundColor Magenta
Write-Host "  ██║  ██║██║██╔══██╗██╔════╝██╔══██╗██║" -ForegroundColor Magenta
Write-Host "  ███████║██║██████╔╝█████╗  ███████║██║" -ForegroundColor Cyan
Write-Host "  ██╔══██║██║██╔══██╗██╔══╝  ██╔══██║██║" -ForegroundColor Cyan
Write-Host "  ██║  ██║██║██║  ██║███████╗██║  ██║██║" -ForegroundColor Blue
Write-Host "  ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝" -ForegroundColor Blue
Write-Host ""
Write-Host "  AI Hiring Intelligence Platform — v2.0" -ForegroundColor White
Write-Host "  ─────────────────────────────────────────" -ForegroundColor DarkGray
Write-Host ""

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# ── Check ngrok ──
$ngrokPath = Join-Path $scriptDir "ngrok.exe"
if (-not (Test-Path $ngrokPath)) {
    Write-Host "  ❌ ngrok.exe not found in project folder." -ForegroundColor Red
    Write-Host "  Please place ngrok.exe in: $scriptDir" -ForegroundColor Yellow
    Write-Host "  Download from: https://ngrok.com/download" -ForegroundColor Cyan
    Write-Host ""
    Read-Host "  Press Enter to exit"
    exit 1
}

# ── Check Flask app ──
$appPath = Join-Path $scriptDir "app.py"
if (-not (Test-Path $appPath)) {
    Write-Host "  ❌ app.py not found!" -ForegroundColor Red
    Read-Host "  Press Enter to exit"
    exit 1
}

Write-Host "  ✅ ngrok found" -ForegroundColor Green
Write-Host "  ✅ app.py found" -ForegroundColor Green
Write-Host ""

# ── Start Flask in background ──
Write-Host "  🚀 Starting Flask server on port 5000..." -ForegroundColor Yellow
$flask = Start-Process -FilePath "python" -ArgumentList "app.py" -WorkingDirectory $scriptDir -PassThru -WindowStyle Minimized
Start-Sleep -Seconds 2
Write-Host "  ✅ Flask running (PID: $($flask.Id))" -ForegroundColor Green
Write-Host ""

# ── Start ngrok ──
Write-Host "  🌐 Starting ngrok tunnel..." -ForegroundColor Yellow
$ngrok = Start-Process -FilePath $ngrokPath -ArgumentList "http 5000 --log=stdout" -PassThru -WindowStyle Minimized
Start-Sleep -Seconds 3

# ── Get public URL from ngrok API ──
$maxRetries = 10
$publicUrl  = $null
for ($i = 0; $i -lt $maxRetries; $i++) {
    try {
        $api = Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels" -ErrorAction SilentlyContinue
        $tunnel = $api.tunnels | Where-Object { $_.proto -eq "https" } | Select-Object -First 1
        if ($tunnel) { $publicUrl = $tunnel.public_url; break }
    } catch {}
    Start-Sleep -Seconds 1
}

Write-Host ""
if ($publicUrl) {
    Write-Host "  ╔══════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "  ║                                                  ║" -ForegroundColor Cyan
    Write-Host "  ║   🔗 PUBLIC URL:                                 ║" -ForegroundColor Cyan
    Write-Host "  ║   $publicUrl" -ForegroundColor White
    Write-Host "  ║                                                  ║" -ForegroundColor Cyan
    Write-Host "  ║   Share this link with anyone!                   ║" -ForegroundColor Green
    Write-Host "  ║   (Valid until you close this window)            ║" -ForegroundColor DarkGray
    Write-Host "  ╚══════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
    # Copy to clipboard
    $publicUrl | Set-Clipboard
    Write-Host "  📋 URL copied to clipboard!" -ForegroundColor Green

    # Open in browser
    Start-Process $publicUrl
    Write-Host "  🌍 Opened in your browser!" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Could not auto-detect URL." -ForegroundColor Yellow
    Write-Host "  Open http://127.0.0.1:4040 to find your public URL." -ForegroundColor Cyan
}

Write-Host ""
Write-Host "  Local:   http://127.0.0.1:5000" -ForegroundColor DarkGray
Write-Host "  ngrok UI: http://127.0.0.1:4040" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  Press Ctrl+C or close this window to stop both servers." -ForegroundColor DarkGray
Write-Host ""

# ── Keep alive until user exits ──
try {
    while ($true) { Start-Sleep -Seconds 5 }
} finally {
    Write-Host ""
    Write-Host "  🛑 Shutting down..." -ForegroundColor Yellow
    if ($flask -and !$flask.HasExited)  { Stop-Process -Id $flask.Id  -Force -ErrorAction SilentlyContinue }
    if ($ngrok -and !$ngrok.HasExited)  { Stop-Process -Id $ngrok.Id  -Force -ErrorAction SilentlyContinue }
    Write-Host "  ✅ All processes stopped." -ForegroundColor Green
}
