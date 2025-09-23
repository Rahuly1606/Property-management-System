# GitHub Actions CI/CD Workflow Guide

This guide explains how to use the GitHub Actions workflow for continuous integration and deployment of the Property Management System.

## Overview

The workflow is defined in the `.github/workflows/deploy.yml` file and consists of three main jobs:

1. **build-backend**: Builds and pushes the Spring Boot backend Docker image to Docker Hub
2. **build-frontend**: Builds and pushes the React frontend Docker image to Docker Hub
3. **deploy**: Deploys the application to an AWS EC2 instance using the Docker images

## Prerequisites

Before you can use this workflow, you need to set up the following:

### 1. Docker Hub Account

- Create an account on [Docker Hub](https://hub.docker.com/) if you don't have one
- Create repositories for your images:
  - `pms-backend`
  - `pms-frontend`

### 2. AWS EC2 Instance

- Set up an EC2 instance with Docker and Docker Compose installed
- Make sure the instance has the necessary security groups configured to allow traffic on ports 80 (HTTP), 8081 (Backend API), and 3307 (MySQL)

### 3. GitHub Secrets

You need to add the following secrets to your GitHub repository:

- `DOCKERHUB_USERNAME`: Your Docker Hub username
- `DOCKERHUB_TOKEN`: Your Docker Hub access token (create one in Docker Hub Account Settings > Security)
- `AWS_HOST`: The public IP address or DNS of your EC2 instance
- `AWS_USERNAME`: The username for SSH access to your EC2 instance (usually `ec2-user`, `ubuntu`, etc.)
- `AWS_SSH_PRIVATE_KEY`: The private SSH key for authentication to your EC2 instance

To add these secrets:
1. Go to your GitHub repository
2. Click on "Settings"
3. In the left sidebar, click on "Secrets and variables" > "Actions"
4. Click "New repository secret" and add each of the secrets mentioned above

## How It Works

### Triggering the Workflow

The workflow will run automatically when:
- You push changes to the `master` branch
- You manually trigger it from the "Actions" tab in GitHub

### Workflow Process

1. **Backend Build**:
   - Checks out the code
   - Sets up Java 17
   - Logs in to Docker Hub
   - Builds and pushes the backend Docker image

2. **Frontend Build**:
   - Checks out the code
   - Sets up Node.js
   - Logs in to Docker Hub
   - Builds and pushes the frontend Docker image

3. **Deployment**:
   - Connects to the EC2 instance via SSH
   - Creates a `docker-compose-prod.yml` file
   - Pulls the latest Docker images
   - Starts the containers
   - Cleans up unused Docker images

## Customization

If you need to modify the workflow:

- **Change the branch name**: Update the `branches` section under `on.push`
- **Add environment variables**: Add more environment variables in the `backend.environment` section of the docker-compose file
- **Change ports**: Modify the port mappings in the `ports` sections of the docker-compose file
- **Update database credentials**: Change the database username, password, and database name in the docker-compose file

## Troubleshooting

If the workflow fails:

1. Check the GitHub Actions logs for detailed error messages
2. Verify that all secrets are correctly set up
3. Ensure your EC2 instance is running and accessible
4. Check if Docker Hub repositories exist and you have permission to push to them
5. SSH into the EC2 instance and check the Docker logs:
   ```
   docker logs pms-backend
   docker logs pms-frontend
   docker logs pms-mysql
   ```

## Manual Deployment

If you need to deploy manually:

1. SSH into your EC2 instance
2. Create a `docker-compose-prod.yml` file with the content from the workflow
3. Run:
   ```
   docker-compose -f docker-compose-prod.yml pull
   docker-compose -f docker-compose-prod.yml up -d
   ```