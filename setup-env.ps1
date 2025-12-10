# PowerShell script to help set up environment files
# Run this script from the project root directory

Write-Host "Setting up Plinko Challenge environment files..." -ForegroundColor Green
Write-Host ""

# Check if backend .env exists
if (Test-Path "backend\.env") {
    Write-Host "⚠️  backend\.env already exists. Skipping..." -ForegroundColor Yellow
} else {
    if (Test-Path "backend\env.example.txt") {
        Copy-Item "backend\env.example.txt" "backend\.env"
        Write-Host "✅ Created backend\.env from env.example.txt" -ForegroundColor Green
        Write-Host "   Please edit backend\.env and fill in your MongoDB URI and other values" -ForegroundColor Yellow
    } else {
        Write-Host "❌ backend\env.example.txt not found!" -ForegroundColor Red
    }
}

Write-Host ""

# Check if frontend .env exists
if (Test-Path "frontend\.env") {
    Write-Host "⚠️  frontend\.env already exists. Skipping..." -ForegroundColor Yellow
} else {
    if (Test-Path "frontend\env.example.txt") {
        Copy-Item "frontend\env.example.txt" "frontend\.env"
        Write-Host "✅ Created frontend\.env from env.example.txt" -ForegroundColor Green
        Write-Host "   Please edit frontend\.env and update API URLs if needed" -ForegroundColor Yellow
    } else {
        Write-Host "❌ frontend\env.example.txt not found!" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit backend\.env and fill in:" -ForegroundColor White
Write-Host "   - MONGODB_URI (your MongoDB connection string)" -ForegroundColor Gray
Write-Host "   - JWT_SECRET (generate a random string)" -ForegroundColor Gray
Write-Host "   - Other values as needed" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Edit frontend\.env if you need to change API URLs" -ForegroundColor White
Write-Host ""
Write-Host "3. Start MongoDB (local or Atlas)" -ForegroundColor White
Write-Host ""
Write-Host "4. Run 'npm run dev' in both backend and frontend directories" -ForegroundColor White
Write-Host ""
Write-Host "See SETUP.md or QUICKSTART.md for detailed instructions!" -ForegroundColor Cyan

