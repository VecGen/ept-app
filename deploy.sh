#!/bin/bash

# AWS App Runner Deployment Script for Efficiency Tracker Frontend
# This script helps prepare and deploy the application to AWS App Runner

set -e

echo "🚀 Preparing Efficiency Tracker Frontend for AWS App Runner deployment..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install AWS CLI first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run linting
echo "🔍 Running linter..."
npm run lint

# Build the application
echo "🏗️  Building application for production..."
NODE_ENV=production npm run build

echo "✅ Build completed successfully!"
echo ""
echo "📋 Deployment Options:"
echo ""
echo "Option 1: Source-based deployment"
echo "1. Push your code to a GitHub repository"
echo "2. In AWS App Runner console, create a new service"
echo "3. Choose 'Source code repository' and connect to your GitHub repo"
echo "4. Use the apprunner.yaml configuration file"
echo ""
echo "Option 2: Container-based deployment"
echo "1. Build and push Docker image:"
echo "   docker build -t efficiency-tracker-frontend ."
echo "   docker tag efficiency-tracker-frontend:latest <your-ecr-repo>:latest"
echo "   docker push <your-ecr-repo>:latest"
echo "2. In AWS App Runner console, create a new service"
echo "3. Choose 'Container registry' and point to your ECR image"
echo ""
echo "🔧 Don't forget to:"
echo "- Update VITE_API_BASE_URL in .env.production with your backend URL"
echo "- Configure environment variables in AWS App Runner console"
echo "- Set up custom domain if needed"
echo ""
echo "🎉 Your app is ready for deployment!" 