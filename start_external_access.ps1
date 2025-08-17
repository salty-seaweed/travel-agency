# Travel Agency - External Access Setup
Write-Host "🌐 Travel Agency - External Access Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Check if Django is installed
try {
    python --version
} catch {
    Write-Host "❌ Python is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Check if ngrok is installed
try {
    ngrok version
    Write-Host "✅ Ngrok is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Ngrok is not installed" -ForegroundColor Red
    Write-Host "Please install ngrok from https://ngrok.com/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "📋 Instructions:" -ForegroundColor Yellow
Write-Host "1. This script will start Django server on 0.0.0.0:8000" -ForegroundColor White
Write-Host "2. Open another terminal and run: ngrok http 8000" -ForegroundColor White
Write-Host "3. Use the ngrok URL to access from external devices" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Press Enter to start Django server, or 'q' to quit"

if ($choice -eq 'q') {
    Write-Host "👋 Goodbye!" -ForegroundColor Green
    exit 0
}

Write-Host ""
Write-Host "🚀 Starting Django server on 0.0.0.0:8000..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

try {
    python manage.py runserver 0.0.0.0:8000
} catch {
    Write-Host "❌ Error starting Django server" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
} 