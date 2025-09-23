# GitHub Actions CI/CD Pipeline Documentation

This document explains how to use the GitHub Actions workflow for automated deployment of the Property Management System.

## Overview

The workflow automates the following steps:
1. Builds and pushes the backend Docker image to Docker Hub
2. Builds and pushes the frontend Docker image to Docker Hub
3. Deploys the application to an AWS EC2 instance using the Docker images

## Required Secrets

Before the workflow can run successfully, you need to set up the following secrets in your GitHub repository:

### Docker Hub Credentials
- `DOCKERHUB_USERNAME`: Your Docker Hub username
- `DOCKERHUB_TOKEN`: Your Docker Hub access token (not your password)

### AWS Deployment Credentials
- `AWS_HOST`: The public IP address or hostname of your EC2 instance
- `AWS_USERNAME`: The username for SSH access to your EC2 instance (typically 'ec2-user' or 'ubuntu')
- `AWS_SSH_PRIVATE_KEY`: The private SSH key for accessing your EC2 instance

### Database Credentials
- `DB_PASSWORD`: The password for your MySQL database

## How to Set Up Secrets

1. Go to your GitHub repository
2. Click on "Settings" tab
3. In the left sidebar, click on "Secrets and variables" -> "Actions"
4. Click on "New repository secret"
5. Add each of the required secrets listed above

## Workflow Triggers

The workflow is triggered on:
- Any push to the `master` branch
- Manual triggering using the "Run workflow" button in the Actions tab

## Local Testing

Before pushing to GitHub, you can test your Docker setup locally using:

```bash
docker compose up -d
```

## Troubleshooting

If the workflow fails:

1. Check that all secrets are correctly set up
2. Verify your Docker images build locally
3. Ensure your EC2 instance has Docker and Docker Compose installed
4. Check that your EC2 security group allows inbound traffic on ports 80 (frontend) and 8081 (backend)
5. Verify SSH access to your EC2 instance

## Important Notes

- The workflow uses port 8081 for the backend service to avoid conflicts
- Make sure your EC2 instance has sufficient resources to run all containers
- Consider setting up a more secure password handling mechanism in production