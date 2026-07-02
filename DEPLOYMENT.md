# 🚀 GOAT Royalties - Deployment Guide

Complete step-by-step instructions for deploying GOAT Royalties to your VPS using Docker Manager.

## 📋 Prerequisites

Before you begin, ensure you have:
- Access to your VPS at `srv832760.hstgr.cloud`
- Docker Manager installed and running
- GitHub repository access
- Basic understanding of Docker concepts

## 🎯 Deployment Methods

### Method 1: Docker Manager (Recommended)

This is the easiest and fastest deployment method.

#### Step 1: Access Docker Manager

1. Open your browser and navigate to your VPS Docker Manager
2. Log in with your credentials
3. Navigate to the "Compose" section

#### Step 2: Deploy Using GitHub URL

1. In the Docker Manager interface, find the "URL" deployment option
2. Paste the following GitHub URL:

```
https://raw.githubusercontent.com/DJSPEEDYGA/nextjs-commerce/goat-royalties-docker-deploy/docker-compose.yml
```

3. Set the **Project Name** to: `goat-royalties`

4. Click **Deploy**

#### Step 3: Wait for Deployment

- Docker Manager will automatically:
  - Pull the docker-compose.yml file from GitHub
  - Download the Node.js base image
  - Build your application container
  - Start the service
  - Configure networking

- This process typically takes 2-5 minutes

#### Step 4: Verify Deployment

1. Once deployment is complete, check the container status in Docker Manager
2. The container should show as "Running" with a green status indicator
3. Access your application at: `http://srv832760.hstgr.cloud:3000`

### Method 2: Manual Docker Compose Deployment

If you prefer manual control or Docker Manager isn't available:

#### Step 1: SSH into Your VPS

```bash
ssh username@srv832760.hstgr.cloud
```

#### Step 2: Clone the Repository

```bash
git clone https://github.com/DJSPEEDYGA/nextjs-commerce.git
cd nextjs-commerce
git checkout goat-royalties-docker-deploy
```

#### Step 3: Configure Environment (Optional)

```bash
cp .env.example .env
nano .env  # Edit with your configuration
```

#### Step 4: Deploy with Docker Compose

```bash
docker-compose up -d
```

#### Step 5: Verify Deployment

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f

# Test the API
curl http://localhost:3000/api/status
```

## 🔧 Configuration Options

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Server Configuration
NODE_ENV=production
PORT=3000

# Optional: Database Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Optional: API Integrations
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
YOUTUBE_API_KEY=your_youtube_api_key
```

### Port Configuration

By default, the application runs on port 3000. To change this:

1. Edit `docker-compose.yml`:
```yaml
ports:
  - "8080:3000"  # Change 8080 to your desired port
```

2. Redeploy:
```bash
docker-compose down
docker-compose up -d
```

## 🌐 Domain Configuration

### Option 1: Using Nginx Reverse Proxy

1. Install Nginx on your VPS:
```bash
sudo apt update
sudo apt install nginx
```

2. Create Nginx configuration:
```bash
sudo nano /etc/nginx/sites-available/goat-royalties
```

3. Add the following configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/goat-royalties /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option 2: Using Docker Manager Port Mapping

In Docker Manager, configure port mapping to expose your application on port 80:
- Container Port: 3000
- Host Port: 80

## 🔒 SSL/HTTPS Configuration

### Using Let's Encrypt with Certbot

1. Install Certbot:
```bash
sudo apt install certbot python3-certbot-nginx
```

2. Obtain SSL certificate:
```bash
sudo certbot --nginx -d yourdomain.com
```

3. Certbot will automatically configure Nginx for HTTPS

## 📊 Monitoring & Maintenance

### View Application Logs

```bash
# Using Docker Compose
docker-compose logs -f

# Using Docker directly
docker logs -f goat-royalties-app
```

### Check Container Health

```bash
# Container status
docker-compose ps

# Health check
curl http://localhost:3000/api/status
```

### Update the Application

```bash
# Pull latest changes
git pull origin goat-royalties-docker-deploy

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### Backup Data

```bash
# Backup volumes
docker run --rm -v goat-data:/data -v $(pwd):/backup alpine tar czf /backup/goat-backup.tar.gz /data
```

## 🐛 Troubleshooting

### Container Won't Start

1. Check logs:
```bash
docker-compose logs
```

2. Verify port availability:
```bash
sudo netstat -tulpn | grep 3000
```

3. Check Docker service:
```bash
sudo systemctl status docker
```

### Application Not Accessible

1. Verify container is running:
```bash
docker-compose ps
```

2. Check firewall rules:
```bash
sudo ufw status
sudo ufw allow 3000
```

3. Test locally:
```bash
curl http://localhost:3000/api/status
```

### High Memory Usage

1. Check container stats:
```bash
docker stats goat-royalties-app
```

2. Restart container:
```bash
docker-compose restart
```

### Database Connection Issues

1. Verify environment variables in `.env`
2. Check network connectivity
3. Review logs for specific error messages

## 🔄 Updating the Application

### Method 1: Using Docker Manager

1. Navigate to your project in Docker Manager
2. Click "Update" or "Redeploy"
3. Docker Manager will pull the latest changes and restart

### Method 2: Manual Update

```bash
cd nextjs-commerce
git pull origin goat-royalties-docker-deploy
docker-compose down
docker-compose up -d --build
```

## 📈 Performance Optimization

### Enable Caching

Add Redis for caching (optional):

```yaml
# Add to docker-compose.yml
redis:
  image: redis:alpine
  restart: unless-stopped
  networks:
    - goat-network
```

### Scale Horizontally

```bash
docker-compose up -d --scale goat-royalties=3
```

## 🆘 Support & Resources

### Quick Reference

- **Application URL**: http://srv832760.hstgr.cloud:3000
- **API Status**: http://srv832760.hstgr.cloud:3000/api/status
- **GitHub Repository**: https://github.com/DJSPEEDYGA/nextjs-commerce
- **Branch**: goat-royalties-docker-deploy

### Common Commands

```bash
# Start application
docker-compose up -d

# Stop application
docker-compose down

# View logs
docker-compose logs -f

# Restart application
docker-compose restart

# Update and rebuild
docker-compose up -d --build

# Check status
docker-compose ps
```

### Getting Help

If you encounter issues:
1. Check the logs first: `docker-compose logs`
2. Verify all prerequisites are met
3. Review this deployment guide
4. Check the main README.md for additional information

## ✅ Post-Deployment Checklist

- [ ] Application is accessible at the configured URL
- [ ] API endpoints are responding correctly
- [ ] Dashboard loads and displays data
- [ ] Container health checks are passing
- [ ] Logs show no critical errors
- [ ] SSL/HTTPS is configured (if using custom domain)
- [ ] Firewall rules are properly configured
- [ ] Backup strategy is in place
- [ ] Monitoring is set up

---

**Congratulations! Your GOAT Royalties platform is now deployed and ready to use! 🎉**