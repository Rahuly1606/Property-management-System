# Kubernetes Deployment Guide for Property Management System

## Prerequisites

1. **Kubernetes Cluster** - One of:
   - Minikube (local)
   - Docker Desktop with Kubernetes
   - Cloud providers (GKE, EKS, AKS)
   - Self-hosted cluster

2. **kubectl** - Kubernetes CLI tool
3. **Docker images** - Backend and Frontend pushed to Docker Hub

---

## Quick Start

### 1. Update Docker Image References

Edit these files and replace `YOUR_DOCKERHUB_USERNAME` with your actual Docker Hub username:
- `kubernetes/backend-deployment.yaml`
- `kubernetes/frontend-deployment.yaml`

Or use the deploy script (see below).

### 2. Update Secrets

Edit `kubernetes/configmap.yaml` and update the secrets:
```yaml
MYSQL_ROOT_PASSWORD: "your-secure-password"
JWT_SECRET: "your-jwt-secret-minimum-32-characters"
CLOUDINARY_CLOUD_NAME: "your-cloudinary-name"
# ... other secrets
```

### 3. Deploy Using Script

```bash
# Make script executable
chmod +x kubernetes/deploy.sh

# Set your Docker Hub username
export DOCKER_USERNAME=your-dockerhub-username

# Run deployment
./kubernetes/deploy.sh
```

### 4. Deploy Manually

```bash
# Create namespace
kubectl apply -f kubernetes/namespace.yaml

# Create ConfigMap and Secrets
kubectl apply -f kubernetes/configmap.yaml

# Create Persistent Volumes
kubectl apply -f kubernetes/persistent-volumes.yaml

# Deploy MySQL
kubectl apply -f kubernetes/mysql-deployment.yaml

# Wait for MySQL
kubectl wait --for=condition=ready pod -l app=mysql -n pms --timeout=300s

# Deploy Backend
kubectl apply -f kubernetes/backend-deployment.yaml

# Wait for Backend
kubectl wait --for=condition=ready pod -l app=backend -n pms --timeout=300s

# Deploy Frontend
kubectl apply -f kubernetes/frontend-deployment.yaml

# Optional: Deploy Ingress
kubectl apply -f kubernetes/ingress.yaml
```

---

## Verify Deployment

```bash
# Check all resources
kubectl get all -n pms

# Check pods
kubectl get pods -n pms

# Check services
kubectl get svc -n pms

# Check persistent volume claims
kubectl get pvc -n pms

# Get frontend URL (LoadBalancer)
kubectl get svc frontend -n pms
```

---

## Access Application

```bash
# Get frontend external IP
kubectl get svc frontend -n pms

# Access application
# Frontend: http://<EXTERNAL-IP>
# Backend: http://<EXTERNAL-IP>:8082
```

---

## Monitoring and Logs

```bash
# View all pods
kubectl get pods -n pms

# View specific pod logs
kubectl logs -f <pod-name> -n pms

# View backend logs
kubectl logs -f -l app=backend -n pms

# View frontend logs
kubectl logs -f -l app=frontend -n pms

# Describe pod (for debugging)
kubectl describe pod <pod-name> -n pms

# Get pod events
kubectl get events -n pms --sort-by='.lastTimestamp'
```

---

## Scaling

```bash
# Manual scaling
kubectl scale deployment backend --replicas=3 -n pms
kubectl scale deployment frontend --replicas=3 -n pms

# Check HPA status
kubectl get hpa -n pms

# Describe HPA
kubectl describe hpa backend-hpa -n pms
```

---

## Updating Application

```bash
# Update backend image
kubectl set image deployment/backend backend=yourusername/pms-backend:v2 -n pms

# Update frontend image
kubectl set image deployment/frontend frontend=yourusername/pms-frontend:v2 -n pms

# Rollout status
kubectl rollout status deployment/backend -n pms
kubectl rollout status deployment/frontend -n pms

# Rollback if needed
kubectl rollout undo deployment/backend -n pms
```

---

## Troubleshooting

### Pods not starting
```bash
kubectl describe pod <pod-name> -n pms
kubectl logs <pod-name> -n pms
```

### Database connection issues
```bash
# Check MySQL pod
kubectl get pod -l app=mysql -n pms

# Check MySQL logs
kubectl logs -l app=mysql -n pms

# Test connection from backend pod
kubectl exec -it <backend-pod-name> -n pms -- sh
nc -zv mysql 3306
```

### Service not accessible
```bash
# Check service
kubectl get svc -n pms

# Check endpoints
kubectl get endpoints -n pms

# Port forward for testing
kubectl port-forward svc/frontend 8080:80 -n pms
kubectl port-forward svc/backend 8082:8082 -n pms
```

---

## Clean Up

```bash
# Delete all resources
kubectl delete namespace pms

# Or delete individually
kubectl delete -f kubernetes/frontend-deployment.yaml
kubectl delete -f kubernetes/backend-deployment.yaml
kubectl delete -f kubernetes/mysql-deployment.yaml
kubectl delete -f kubernetes/persistent-volumes.yaml
kubectl delete -f kubernetes/configmap.yaml
kubectl delete -f kubernetes/namespace.yaml
```

---

## Configuration Files

- `namespace.yaml` - Namespace definition
- `configmap.yaml` - Configuration and secrets
- `persistent-volumes.yaml` - Storage claims
- `mysql-deployment.yaml` - MySQL database
- `backend-deployment.yaml` - Backend API with HPA
- `frontend-deployment.yaml` - Frontend with HPA
- `ingress.yaml` - Ingress controller (optional)
- `deploy.sh` - Automated deployment script

---

## Best Practices

1. **Use Secrets Manager** - Don't hardcode secrets in YAML files
2. **Resource Limits** - Set appropriate CPU/memory limits
3. **Health Checks** - Configure liveness and readiness probes
4. **Auto-scaling** - Use HPA for automatic scaling
5. **Monitoring** - Set up Prometheus and Grafana
6. **Logging** - Use ELK stack or similar
7. **Backup** - Regular database backups
8. **SSL/TLS** - Use cert-manager for HTTPS

---

## Cloud Provider Specifics

### GKE (Google Kubernetes Engine)
```bash
gcloud container clusters create pms-cluster --num-nodes=3
gcloud container clusters get-credentials pms-cluster
```

### EKS (Amazon Elastic Kubernetes Service)
```bash
eksctl create cluster --name pms-cluster --nodes=3
aws eks update-kubeconfig --name pms-cluster
```

### AKS (Azure Kubernetes Service)
```bash
az aks create --resource-group myRG --name pms-cluster --node-count 3
az aks get-credentials --resource-group myRG --name pms-cluster
```

---

For detailed Kubernetes documentation, visit: https://kubernetes.io/docs/
