# Ngrok Authentication Setup Script
Write-Host "🔑 Ngrok Authentication Setup" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan

# Check if ngrok is installed
try {
    $ngrokVersion = ngrok version
    Write-Host "✅ Ngrok is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Ngrok is not installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "📦 To install ngrok:" -ForegroundColor Yellow
    Write-Host "1. Go to https://ngrok.com/" -ForegroundColor White
    Write-Host "2. Sign up for a free account" -ForegroundColor White
    Write-Host "3. Download for Windows" -ForegroundColor White
    Write-Host "4. Extract and add to your PATH" -ForegroundColor White
    Write-Host "5. Run this script again" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "📋 To get your ngrok auth token:" -ForegroundColor Yellow
Write-Host "1. Go to https://ngrok.com/" -ForegroundColor White
Write-Host "2. Sign up for a free account" -ForegroundColor White
Write-Host "3. Go to https://dashboard.ngrok.com/get-started/your-authtoken" -ForegroundColor White
Write-Host "4. Copy your auth token" -ForegroundColor White
Write-Host ""

$token = Read-Host "🔑 Enter your ngrok auth token"

if (-not $token) {
    Write-Host "❌ No token provided" -ForegroundColor Red
    exit 1
}

if ($token.Length -lt 20) {
    Write-Host "❌ Token seems too short. Please check your token" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔧 Configuring ngrok with your auth token..." -ForegroundColor Yellow

try {
    ngrok config add-authtoken $token
    Write-Host "✅ Ngrok configured successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Error configuring ngrok" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🧪 Testing ngrok configuration..." -ForegroundColor Yellow

try {
    ngrok version
    Write-Host "✅ Ngrok is working correctly!" -ForegroundColor Green
} catch {
    Write-Host "❌ Ngrok test failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Ngrok Setup Complete!" -ForegroundColor Green
Write-Host "=====================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Start Django server: python manage.py runserver 0.0.0.0:8000" -ForegroundColor White
Write-Host "2. Start ngrok tunnel: ngrok http 8000" -ForegroundColor White
Write-Host "3. Use the ngrok URL to access from external devices" -ForegroundColor White
Write-Host ""
Write-Host "💡 Quick commands:" -ForegroundColor Yellow
Write-Host "   # Terminal 1: Django" -ForegroundColor White
Write-Host "   python manage.py runserver 0.0.0.0:8000" -ForegroundColor White
Write-Host "   " -ForegroundColor White
Write-Host "   # Terminal 2: Ngrok" -ForegroundColor White
Write-Host "   ngrok http 8000" -ForegroundColor White
Write-Host "   " -ForegroundColor White
Write-Host "   # Terminal 3: Frontend (optional)" -ForegroundColor White
Write-Host "   cd frontend" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White 