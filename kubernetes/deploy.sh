#!/bin/bash

# Kubernetes Deployment Script for Property Management System
# This script deploys the PMS application to Kubernetes cluster

set -e

echo "=================================="
echo "PMS Kubernetes Deployment Script"
echo "=================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
NAMESPACE="pms"
DOCKER_USERNAME="${DOCKER_USERNAME:-YOUR_DOCKERHUB_USERNAME}"

# Function to print colored messages
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    print_error "kubectl is not installed. Please install kubectl first."
    exit 1
fi

# Check if cluster is accessible
if ! kubectl cluster-info &> /dev/null; then
    print_error "Cannot connect to Kubernetes cluster. Please check your kubeconfig."
    exit 1
fi

print_info "Connected to Kubernetes cluster"
kubectl cluster-info

# Update Docker image references if username is provided
if [ "$DOCKER_USERNAME" != "YOUR_DOCKERHUB_USERNAME" ]; then
    print_info "Updating Docker image references with username: $DOCKER_USERNAME"
    sed -i "s|YOUR_DOCKERHUB_USERNAME|$DOCKER_USERNAME|g" kubernetes/backend-deployment.yaml
    sed -i "s|YOUR_DOCKERHUB_USERNAME|$DOCKER_USERNAME|g" kubernetes/frontend-deployment.yaml
fi

# Create namespace
print_info "Creating namespace: $NAMESPACE"
kubectl apply -f kubernetes/namespace.yaml

# Create ConfigMap and Secrets
print_info "Creating ConfigMap and Secrets"
kubectl apply -f kubernetes/configmap.yaml

# Create Persistent Volume Claims
print_info "Creating Persistent Volume Claims"
kubectl apply -f kubernetes/persistent-volumes.yaml

# Deploy MySQL
print_info "Deploying MySQL database"
kubectl apply -f kubernetes/mysql-deployment.yaml

# Wait for MySQL to be ready
print_info "Waiting for MySQL to be ready..."
kubectl wait --for=condition=ready pod -l app=mysql -n $NAMESPACE --timeout=300s

# Deploy Backend
print_info "Deploying Backend application"
kubectl apply -f kubernetes/backend-deployment.yaml

# Wait for Backend to be ready
print_info "Waiting for Backend to be ready..."
kubectl wait --for=condition=ready pod -l app=backend -n $NAMESPACE --timeout=300s

# Deploy Frontend
print_info "Deploying Frontend application"
kubectl apply -f kubernetes/frontend-deployment.yaml

# Wait for Frontend to be ready
print_info "Waiting for Frontend to be ready..."
kubectl wait --for=condition=ready pod -l app=frontend -n $NAMESPACE --timeout=180s

# Optional: Deploy Ingress
read -p "Do you want to deploy Ingress? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Deploying Ingress"
    kubectl apply -f kubernetes/ingress.yaml
fi

# Display deployment status
echo ""
echo "=================================="
print_info "Deployment Summary"
echo "=================================="

kubectl get all -n $NAMESPACE

echo ""
print_info "Services:"
kubectl get svc -n $NAMESPACE

echo ""
print_info "Pods:"
kubectl get pods -n $NAMESPACE

echo ""
print_info "Persistent Volume Claims:"
kubectl get pvc -n $NAMESPACE

# Get frontend service external IP
echo ""
print_info "Getting Frontend Service URL..."
FRONTEND_URL=$(kubectl get svc frontend -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "pending")

if [ "$FRONTEND_URL" != "pending" ]; then
    echo ""
    print_info "=================================="
    print_info "Application is accessible at:"
    print_info "Frontend: http://$FRONTEND_URL"
    print_info "Backend API: http://$FRONTEND_URL:8082"
    print_info "=================================="
else
    print_warning "Frontend LoadBalancer IP is still pending. Run this command to check:"
    echo "kubectl get svc frontend -n $NAMESPACE"
fi

echo ""
print_info "Deployment completed successfully!"
print_info "Use 'kubectl logs -f <pod-name> -n $NAMESPACE' to view logs"
print_info "Use 'kubectl describe pod <pod-name> -n $NAMESPACE' to debug issues"
