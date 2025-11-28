# PowerShell Deployment Script for Windows
# Property Management System - Kubernetes Deployment

param(
    [string]$DockerUsername = "",
    [string]$Action = "deploy",
    [switch]$Help
)

$ErrorActionPreference = "Stop"

# Colors
function Write-Info { Write-Host "[INFO] $args" -ForegroundColor Green }
function Write-Warn { Write-Host "[WARN] $args" -ForegroundColor Yellow }
function Write-Err { Write-Host "[ERROR] $args" -ForegroundColor Red }

if ($Help) {
    Write-Host @"
Property Management System - Kubernetes Deployment Script

Usage: .\deploy.ps1 -DockerUsername <username> [-Action <action>]

Actions:
  deploy    - Deploy all resources to Kubernetes (default)
  delete    - Delete all resources from Kubernetes
  status    - Check deployment status
  logs      - View application logs
  update    - Update existing deployment

Examples:
  .\deploy.ps1 -DockerUsername rahuly1606
  .\deploy.ps1 -DockerUsername rahuly1606 -Action status
  .\deploy.ps1 -Action delete

"@
    exit 0
}

Write-Host "=================================="
Write-Host "PMS Kubernetes Deployment Script"
Write-Host "=================================="
Write-Host ""

# Check if kubectl is installed
try {
    kubectl version --client | Out-Null
    Write-Info "kubectl is installed"
}
catch {
    Write-Err "kubectl is not installed. Please install kubectl first."
    Write-Host "Install with: choco install kubernetes-cli"
    exit 1
}

# Check if cluster is accessible
try {
    kubectl cluster-info | Out-Null
    Write-Info "Connected to Kubernetes cluster"
}
catch {
    Write-Err "Cannot connect to Kubernetes cluster."
    Write-Host "Please ensure:"
    Write-Host "  - Docker Desktop Kubernetes is enabled, OR"
    Write-Host "  - Minikube is running (minikube start)"
    exit 1
}

$Namespace = "pms"

# Function to update Docker username
function Update-DockerUsername {
    param([string]$Username)
    
    if ($Username -and $Username -ne "YOUR_DOCKERHUB_USERNAME") {
        Write-Info "Updating Docker image references with username: $Username"
        
        $backendFile = "kubernetes\backend-deployment.yaml"
        $frontendFile = "kubernetes\frontend-deployment.yaml"
        
        (Get-Content $backendFile) -replace 'YOUR_DOCKERHUB_USERNAME', $Username | Set-Content $backendFile
        (Get-Content $frontendFile) -replace 'YOUR_DOCKERHUB_USERNAME', $Username | Set-Content $frontendFile
        
        Write-Info "Docker username updated in deployment files"
    }
}

# Function to deploy
function Deploy-Application {
    Write-Info "Starting deployment to Kubernetes..."
    
    # Create namespace
    Write-Info "Creating namespace: $Namespace"
    kubectl apply -f kubernetes\namespace.yaml
    
    # Create ConfigMap and Secrets
    Write-Info "Creating ConfigMap and Secrets"
    kubectl apply -f kubernetes\configmap.yaml
    
    # Create Persistent Volumes
    Write-Info "Creating Persistent Volume Claims"
    kubectl apply -f kubernetes\persistent-volumes.yaml
    
    # Deploy MySQL
    Write-Info "Deploying MySQL database"
    kubectl apply -f kubernetes\mysql-deployment.yaml
    
    # Wait for MySQL
    Write-Info "Waiting for MySQL to be ready (this may take 1-2 minutes)..."
    kubectl wait --for=condition=ready pod -l app=mysql -n $Namespace --timeout=300s
    
    # Deploy Backend
    Write-Info "Deploying Backend application"
    kubectl apply -f kubernetes\backend-deployment.yaml
    
    # Wait for Backend
    Write-Info "Waiting for Backend to be ready (this may take 1-2 minutes)..."
    kubectl wait --for=condition=ready pod -l app=backend -n $Namespace --timeout=300s
    
    # Deploy Frontend
    Write-Info "Deploying Frontend application"
    kubectl apply -f kubernetes\frontend-deployment.yaml
    
    # Wait for Frontend
    Write-Info "Waiting for Frontend to be ready..."
    kubectl wait --for=condition=ready pod -l app=frontend -n $Namespace --timeout=180s
    
    Show-Status
}

# Function to delete
function Delete-Application {
    Write-Warn "Deleting all resources from namespace: $Namespace"
    $confirm = Read-Host "Are you sure? (yes/no)"
    if ($confirm -eq "yes") {
        kubectl delete namespace $Namespace
        Write-Info "All resources deleted"
    }
    else {
        Write-Info "Deletion cancelled"
    }
}

# Function to show status
function Show-Status {
    Write-Host ""
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host "Deployment Status" -ForegroundColor Cyan
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host ""
    
    kubectl get all -n $Namespace
    
    Write-Host ""
    Write-Info "Services:"
    kubectl get svc -n $Namespace
    
    Write-Host ""
    Write-Info "Persistent Volume Claims:"
    kubectl get pvc -n $Namespace
    
    # Try to get frontend URL
    Write-Host ""
    Write-Info "Getting Frontend URL..."
    
    $frontendIP = kubectl get svc frontend -n $Namespace -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>$null
    
    if ($frontendIP) {
        Write-Host ""
        Write-Host "==================================" -ForegroundColor Green
        Write-Info "Application URLs:"
        Write-Host "Frontend: http://$frontendIP" -ForegroundColor Cyan
        Write-Host "Backend:  http://$frontendIP:8082" -ForegroundColor Cyan
        Write-Host "==================================" -ForegroundColor Green
    }
    else {
        Write-Host ""
        Write-Info "Frontend service is using LoadBalancer."
        Write-Info "For Docker Desktop: Access via http://localhost"
        Write-Info "For Minikube: Run 'minikube service frontend -n pms'"
        
        Write-Host ""
        Write-Host "Port Forward Option:" -ForegroundColor Yellow
        Write-Host "  kubectl port-forward svc/frontend 8080:80 -n pms" -ForegroundColor Cyan
        Write-Host "  Then access: http://localhost:8080" -ForegroundColor Cyan
    }
}

# Function to show logs
function Show-Logs {
    Write-Info "Application Logs:"
    Write-Host ""
    Write-Host "Backend logs:" -ForegroundColor Cyan
    kubectl logs -l app=backend -n $Namespace --tail=50
    
    Write-Host ""
    Write-Host "Frontend logs:" -ForegroundColor Cyan
    kubectl logs -l app=frontend -n $Namespace --tail=50
}

# Function to update deployment
function Update-Deployment {
    Write-Info "Updating deployment..."
    kubectl rollout restart deployment/backend -n $Namespace
    kubectl rollout restart deployment/frontend -n $Namespace
    
    Write-Info "Waiting for rollout to complete..."
    kubectl rollout status deployment/backend -n $Namespace
    kubectl rollout status deployment/frontend -n $Namespace
    
    Write-Info "Update complete!"
    Show-Status
}

# Main execution
switch ($Action.ToLower()) {
    "deploy" {
        Update-DockerUsername -Username $DockerUsername
        Deploy-Application
    }
    "delete" {
        Delete-Application
    }
    "status" {
        Show-Status
    }
    "logs" {
        Show-Logs
    }
    "update" {
        Update-Deployment
    }
    default {
        Write-Err "Unknown action: $Action"
        Write-Host "Use -Help for usage information"
        exit 1
    }
}

Write-Host ""
Write-Info "Script completed successfully!"
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Yellow
Write-Host "  kubectl get pods -n pms" -ForegroundColor Cyan
Write-Host "  kubectl logs -f <pod-name> -n pms" -ForegroundColor Cyan
Write-Host "  kubectl describe pod <pod-name> -n pms" -ForegroundColor Cyan
Write-Host "  kubectl port-forward svc/frontend 8080:80 -n pms" -ForegroundColor Cyan
