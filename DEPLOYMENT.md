# StreamFlow Deployment Guide

This guide will help you deploy the StreamFlow live streaming application to production using Docker and Docker Compose.

## 🏗️ Architecture Overview

The StreamFlow application consists of:

- **Frontend**: React application with Vite, served by Nginx
- **Backend**: Express.js API server with Socket.IO for WebRTC
- **Database**: MongoDB for user and stream data
- **Reverse Proxy**: Nginx for load balancing and SSL termination

## 📋 Prerequisites

### Required Software
- [Docker](https://www.docker.com/) (version 20.10+)
- [Docker Compose](https://docs.docker.com/compose/) (version 2.0+)
- [Git](https://git-scm.com/) for cloning the repository

### System Requirements
- **RAM**: Minimum 4GB, recommended 8GB+
- **Storage**: Minimum 20GB free space
- **Network**: Stable internet connection
- **Ports**: 80, 443, 3000, 5000 must be available

## 🚀 Quick Deployment

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd streamflow
```

### 2. Configure Environment Variables
```bash
# Copy the environment template
cp .env.example .env

# Edit the .env file with your production values
nano .env  # or use your preferred editor
```

**Important: Change these values in production:**
- `MONGO_ROOT_PASSWORD` - Set a strong MongoDB password
- `JWT_SECRET` - Use a secure random string (32+ characters)
- `FRONTEND_URL` - Set to your production domain
- `VITE_API_URL` - Set to your production API URL

### 3. Run the Deployment Script

**For Linux/macOS:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**For Windows:**
```cmd
deploy.bat
```

### 4. Access Your Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 🔧 Manual Deployment Steps

If you prefer to deploy manually:

### 1. Build and Start Services
```bash
# Create necessary directories
mkdir -p nginx/ssl backend/uploads

# Build all services
docker-compose build --no-cache

# Start all services
docker-compose up -d

# Check service status
docker-compose ps
```

### 2. Verify Deployment
```bash
# Check backend health
curl http://localhost:5000/api/health

# Check frontend
curl http://localhost:3000

# View logs
docker-compose logs -f
```

## 🔒 SSL/HTTPS Setup

### Option 1: Using Let's Encrypt (Recommended)

1. **Install Certbot**
```bash
# On Ubuntu/Debian
sudo apt update
sudo apt install certbot

# On CentOS/RHEL
sudo yum install certbot
```

2. **Generate SSL Certificate**
```bash
# Replace your-domain.com with your actual domain
sudo certbot certonly --standalone -d your-domain.com
```

3. **Update Nginx Configuration**
```bash
# Copy certificates to nginx directory
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem nginx/ssl/key.pem
```

4. **Enable HTTPS in Nginx**
Edit `nginx/nginx.conf` and uncomment the HTTPS server block.

### Option 2: Self-Signed Certificate (Development Only)

```bash
# Generate self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
```

## 📊 Monitoring and Maintenance

### Health Checks
All services include health checks:
```bash
# Check all service health
docker-compose ps

# Check specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb
```

### Backup Database
```bash
# Create backup
docker-compose exec mongodb mongodump --out /backup/$(date +%Y%m%d_%H%M%S)

# Restore from backup
docker-compose exec mongodb mongorestore /backup/backup_directory
```

### Update Application
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose build
docker-compose up -d
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using the port
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443

# Kill the process if needed
sudo kill -9 <PID>
```

#### 2. MongoDB Connection Failed
```bash
# Check MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

#### 3. Frontend Not Loading
```bash
# Check Nginx logs
docker-compose logs nginx

# Restart frontend services
docker-compose restart frontend nginx
```

#### 4. Backend API Not Responding
```bash
# Check backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

### Performance Optimization

#### 1. Database Indexing
The MongoDB initialization script automatically creates necessary indexes. Check them with:
```bash
docker-compose exec mongodb mongosh streamflow --eval "db.users.getIndexes()"
```

#### 2. Nginx Caching
The Nginx configuration includes static asset caching. Adjust cache times in `nginx/nginx.conf` if needed.

#### 3. Resource Limits
Monitor resource usage:
```bash
# Check container resource usage
docker stats

# Check disk space
df -h
```

## 🔐 Security Considerations

### Production Security Checklist

- [ ] Change all default passwords in `.env`
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Set up firewall rules
- [ ] Regularly update Docker images
- [ ] Monitor logs for suspicious activity
- [ ] Set up database backups
- [ ] Configure rate limiting (already included in Nginx)

### Firewall Configuration
```bash
# Allow HTTP/HTTPS only
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 📈 Scaling

### Horizontal Scaling

For high-traffic deployments, you can scale services:

```bash
# Scale backend (multiple instances)
docker-compose up -d --scale backend=3

# Scale frontend (multiple instances)
docker-compose up -d --scale frontend=2
```

### Load Balancing

The Nginx configuration automatically load balances between multiple instances of the same service.

## 🚀 Production Deployment Checklist

- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Database backups configured
- [ ] Monitoring set up
- [ ] Log rotation configured
- [ ] Security updates planned
- [ ] Performance testing completed
- [ ] Disaster recovery plan in place

## 📞 Support

If you encounter issues during deployment:

1. Check the troubleshooting section above
2. Review container logs: `docker-compose logs -f`
3. Verify all prerequisites are met
4. Ensure all environment variables are correctly set

## 🔄 CI/CD Integration

For automated deployments, you can integrate this with GitHub Actions, GitLab CI, or other CI/CD platforms. The deployment scripts are designed to be non-interactive for automation.

---

**🎉 Congratulations! Your StreamFlow application is now deployed and ready for users!**
