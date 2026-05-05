@echo off
REM StreamFlow Deployment Script for Windows
REM This script deploys the StreamFlow application using Docker Compose

echo 🚀 Starting StreamFlow deployment...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Docker Compose is available
docker compose version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not available. Please ensure Docker Desktop is running.
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist .env (
    echo 📝 Creating .env file from template...
    copy .env.example .env >nul
    echo ⚠️  Please edit .env file with your production values before continuing!
    echo    Important: Change MongoDB password, JWT secret, and other sensitive values.
    pause
)

REM Create necessary directories
echo 📁 Creating necessary directories...
if not exist nginx\ssl mkdir nginx\ssl
if not exist backend\uploads mkdir backend\uploads

REM Build and start services
echo 🔨 Building and starting services...
docker-compose down --volumes --remove-orphans
docker-compose build --no-cache
docker-compose up -d

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 30 /nobreak >nul

REM Check service health
echo 🔍 Checking service health...
echo Backend health check:
curl -f http://localhost:5000/api/health || echo ❌ Backend not ready yet

echo Frontend check:
curl -f http://localhost:3000 || echo ❌ Frontend not ready yet

echo MongoDB connection check:
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')" || echo ❌ MongoDB not ready yet

REM Show running containers
echo 📋 Running containers:
docker-compose ps

REM Show logs if there are issues
echo.
echo 📊 Recent logs:
docker-compose logs --tail=20

echo.
echo ✅ StreamFlow deployment completed!
echo.
echo 🌐 Access your application at:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:5000
echo    API Health: http://localhost:5000/api/health
echo.
echo 🔧 Useful commands:
echo    View logs: docker-compose logs -f
echo    Stop services: docker-compose down
echo    Restart services: docker-compose restart
echo    Update application: git pull ^&^& docker-compose build ^&^& docker-compose up -d
echo.
echo 📚 For SSL/HTTPS setup, see the deployment documentation.
pause
