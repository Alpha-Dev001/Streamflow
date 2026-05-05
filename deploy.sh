#!/bin/bash

# StreamFlow Deployment Script
# This script deploys the StreamFlow application using Docker Compose

set -e

echo "🚀 Starting StreamFlow deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your production values before continuing!"
    echo "   Important: Change MongoDB password, JWT secret, and other sensitive values."
    read -p "Press Enter after you've configured the .env file..."
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p nginx/ssl
mkdir -p backend/uploads

# Build and start services
echo "🔨 Building and starting services..."
docker-compose down --volumes --remove-orphans
docker-compose build --no-cache
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check service health
echo "🔍 Checking service health..."
echo "Backend health check:"
curl -f http://localhost:5000/api/health || echo "❌ Backend not ready yet"

echo "Frontend check:"
curl -f http://localhost:3000 || echo "❌ Frontend not ready yet"

echo "MongoDB connection check:"
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')" || echo "❌ MongoDB not ready yet"

# Show running containers
echo "📋 Running containers:"
docker-compose ps

# Show logs if there are issues
echo ""
echo "📊 Recent logs:"
docker-compose logs --tail=20

echo ""
echo "✅ StreamFlow deployment completed!"
echo ""
echo "🌐 Access your application at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo "   API Health: http://localhost:5000/api/health"
echo ""
echo "🔧 Useful commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart services: docker-compose restart"
echo "   Update application: git pull && docker-compose build && docker-compose up -d"
echo ""
echo "📚 For SSL/HTTPS setup, see the deployment documentation."
