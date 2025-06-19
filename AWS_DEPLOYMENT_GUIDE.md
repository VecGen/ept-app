# AWS App Runner Deployment Guide

This guide will help you deploy the Efficiency Tracker Frontend to AWS App Runner.

## Prerequisites

- AWS CLI installed and configured
- Node.js 18+ installed
- Docker installed (for container-based deployment)
- GitHub repository (for source-based deployment)

## Files Created for Deployment

- `apprunner.yaml` - AWS App Runner configuration for source-based deployment
- `Dockerfile` - Container configuration for container-based deployment
- `nginx.conf` - Nginx configuration for serving the SPA
- `.dockerignore` - Optimizes Docker builds
- `.env.production` - Production environment variables
- `deploy.sh` - Deployment preparation script

## Deployment Options

### Option 1: Source-Based Deployment (Recommended)

1. **Prepare the application:**
   ```bash
   ./deploy.sh
   ```

2. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for AWS App Runner deployment"
   git push origin main
   ```

3. **Create App Runner Service:**
   - Go to [AWS App Runner Console](https://console.aws.amazon.com/apprunner/)
   - Click "Create service"
   - Choose "Source code repository"
   - Connect to your GitHub repository
   - Select the repository and branch
   - Use automatic deployment settings

4. **Configure Environment Variables:**
   Add these in the App Runner console:
   ```
   NODE_ENV=production
   VITE_APP_ENV=production
   VITE_MOCK_MODE=false
   VITE_API_BASE_URL=https://your-backend-url.com
   VITE_DEBUG=false
   ```

### Option 2: Container-Based Deployment

1. **Build and tag the Docker image:**
   ```bash
   docker build -t efficiency-tracker-frontend .
   ```

2. **Push to Amazon ECR:**
   ```bash
   # Create ECR repository
   aws ecr create-repository --repository-name efficiency-tracker-frontend

   # Get login token
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

   # Tag and push
   docker tag efficiency-tracker-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/efficiency-tracker-frontend:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/efficiency-tracker-frontend:latest
   ```

3. **Create App Runner Service:**
   - Go to AWS App Runner Console
   - Choose "Container registry"
   - Select your ECR image
   - Configure port 8080

## Configuration Details

### Environment Variables

Update `.env.production` with your actual backend URL:
```env
VITE_API_BASE_URL=https://your-backend-app-runner-url.com
```

### App Runner Configuration

The `apprunner.yaml` file includes:
- Node.js 18 runtime
- Build commands for Vite
- Production environment setup
- Port 8080 configuration

### Docker Configuration

The Dockerfile uses:
- Multi-stage build for optimization
- Alpine Linux for smaller image size
- Nginx for serving static files
- Proper SPA routing support

## Post-Deployment

1. **Custom Domain (Optional):**
   - Configure custom domain in App Runner console
   - Update DNS records

2. **HTTPS:**
   - App Runner provides automatic HTTPS
   - No additional configuration needed

3. **Monitoring:**
   - Enable CloudWatch logs in App Runner
   - Set up CloudWatch alarms if needed

## Troubleshooting

### Build Failures
- Check Node.js version (must be 18+)
- Verify all dependencies are in package.json
- Check build logs in App Runner console

### Runtime Issues
- Verify environment variables are set correctly
- Check application logs in CloudWatch
- Ensure backend API URL is accessible

### Performance
- Enable gzip compression (included in nginx.conf)
- Use CloudFront for CDN if needed
- Monitor performance metrics in CloudWatch

## Cost Optimization

- Use automatic scaling in App Runner
- Consider pausing/stopping during development
- Monitor costs in AWS Cost Explorer

## Security

- App Runner provides automatic security updates
- HTTPS is enabled by default
- Security headers are configured in nginx.conf
- Consider WAF for additional protection

For support, check AWS App Runner documentation or open an issue in the repository. 