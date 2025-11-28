# 🚀 Ansible Deployment Guide - Property Management System

## 📋 Prerequisites

### 1. WSL Ubuntu Setup (Already Done ✅)
You already have WSL Ubuntu installed and Ansible configured.

### 2. Verify Ansible Installation
```bash
# In WSL Ubuntu terminal
ansible --version
```

## 🎯 Quick Start - Deploy to Production Server

### Step 1: Open WSL Ubuntu
```powershell
# From PowerShell
wsl -d Ubuntu-22.04
```

### Step 2: Navigate to Project
```bash
cd /mnt/c/Users/alexr/PROJECTS/PMS/ansible
```

### Step 3: Test Connectivity
```bash
# Ping the production server
ansible -i inventory.ini production -m ping

# Expected output:
# 10.50.49.46 | SUCCESS => {
#     "changed": false,
#     "ping": "pong"
# }
```

### Step 4: Deploy Application
```bash
# Deploy to production server (10.50.49.46)
ansible-playbook -i inventory.ini deploy.yml --limit production

# Or deploy to localhost
ansible-playbook -i inventory.ini deploy.yml --limit local
```

### Step 5: Monitor Deployment
The playbook will:
1. ✅ Install Docker and Docker Compose
2. ✅ Copy application files to `/opt/pms`
3. ✅ Create environment configuration
4. ✅ Build and start containers
5. ✅ Run health checks
6. ✅ Display deployment summary

**Deployment time**: ~10-15 minutes (first time), ~5 minutes (subsequent)

---

## 📝 Detailed Steps

### Configuration Files

#### 1. **inventory.ini** (Target Servers)
```ini
[production]
10.50.49.46 ansible_user=rahul12 ansible_connection=local

[local]
localhost ansible_connection=local
```

#### 2. **vars.yml** (Configuration Variables)
```yaml
app_name: pms
app_dir: /opt/pms
mysql_root_password: "Rahul@1606"
mysql_database: pmsbackend
backend_port: 8082
frontend_port: 80
```

#### 3. **deploy.yml** (Deployment Playbook)
Main playbook that orchestrates the deployment.

---

## 🔧 Deployment Options

### Option 1: Deploy to Production Server (10.50.49.46)
```bash
# Full deployment
ansible-playbook -i inventory.ini deploy.yml --limit production

# Check syntax first
ansible-playbook -i inventory.ini deploy.yml --limit production --syntax-check

# Dry run (check what will be changed)
ansible-playbook -i inventory.ini deploy.yml --limit production --check

# Verbose output
ansible-playbook -i inventory.ini deploy.yml --limit production -vvv
```

### Option 2: Deploy to Localhost
```bash
ansible-playbook -i inventory.ini deploy.yml --limit local
```

### Option 3: Clean Deployment (Remove Old Data)
```bash
# This will remove all Docker images and volumes
ansible-playbook -i inventory.ini deploy.yml --limit production -e "clean_deployment=true"
```

### Option 4: Deploy with Custom Variables
```bash
# Override default variables
ansible-playbook -i inventory.ini deploy.yml --limit production \
  -e "mysql_root_password=NewPassword123" \
  -e "backend_port=9090"
```

---

## 📊 What Happens During Deployment

### Phase 1: Pre-Deployment (2-3 minutes)
```
✓ Update package cache
✓ Install required packages (curl, git, etc.)
✓ Add Docker GPG key
✓ Add Docker repository
```

### Phase 2: Docker Installation (3-5 minutes)
```
✓ Install Docker CE
✓ Install containerd
✓ Start Docker service
✓ Add user to docker group
✓ Download Docker Compose
```

### Phase 3: Application Deployment (3-5 minutes)
```
✓ Create /opt/pms directory
✓ Copy application files (excluding node_modules, .git)
✓ Generate .env file from template
✓ Stop existing containers
✓ Build Docker images
✓ Start containers (MySQL → Backend → Frontend)
```

### Phase 4: Health Checks (2-3 minutes)
```
✓ Wait for MySQL (port 3307)
✓ Wait for Backend (port 8082)
✓ Wait for Frontend (port 80)
✓ Check backend health endpoint
✓ Check frontend health endpoint
```

### Phase 5: Summary
```
✓ Display deployment status
✓ Show container status
✓ Show access URLs
```

---

## 🎬 Complete Deployment Example

```bash
# 1. Open WSL Ubuntu
PS C:\Users\alexr> wsl -d Ubuntu-22.04

# 2. Navigate to ansible directory
rahul12@DESKTOP:~$ cd /mnt/c/Users/alexr/PROJECTS/PMS/ansible

# 3. Test connectivity
rahul12@DESKTOP:/mnt/c/Users/alexr/PROJECTS/PMS/ansible$ ansible -i inventory.ini production -m ping
10.50.49.46 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}

# 4. Run deployment
rahul12@DESKTOP:/mnt/c/Users/alexr/PROJECTS/PMS/ansible$ ansible-playbook -i inventory.ini deploy.yml --limit production

PLAY [Deploy Property Management System] *************************************

TASK [Gathering Facts] ********************************************************
ok: [10.50.49.46]

TASK [Update apt cache] *******************************************************
changed: [10.50.49.46]

TASK [Install required packages] **********************************************
changed: [10.50.49.46]

... (many more tasks) ...

TASK [Display deployment summary] *********************************************
ok: [10.50.49.46] => {
    "msg": [
        "===================================================",
        "Property Management System Deployment Complete!",
        "===================================================",
        "Frontend URL: http://10.50.49.46:80",
        "Backend URL: http://10.50.49.46:8082",
        "MySQL Port: 3307",
        "===================================================",
        "Backend Health: OK",
        "Frontend Health: OK",
        "==================================================="
    ]
}

PLAY RECAP ********************************************************************
10.50.49.46              : ok=25   changed=12   unreachable=0    failed=0
```

---

## 🔍 Verification Commands

### On WSL Ubuntu (Ansible Host)
```bash
# Check playbook syntax
ansible-playbook -i inventory.ini deploy.yml --syntax-check

# List all hosts
ansible -i inventory.ini all --list-hosts

# Check connection to production server
ansible -i inventory.ini production -m ping

# Get system info from production server
ansible -i inventory.ini production -m setup
```

### On Production Server (10.50.49.46)
```bash
# SSH into the server (if remote)
ssh rahul12@10.50.49.46

# Check Docker status
docker ps

# Check application logs
cd /opt/pms
docker-compose logs -f

# Check container health
docker-compose ps

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql-db
```

### From Your Browser
After deployment, access:
- **Frontend**: http://10.50.49.46 (or http://10.50.49.46:80)
- **Backend API**: http://10.50.49.46:8082/api
- **MySQL**: 10.50.49.46:3307 (use MySQL client)

---

## 🛠️ Troubleshooting

### Issue 1: Ansible Connection Failed
```bash
# Error: "Failed to connect to the host"
# Solution: Check SSH connectivity
ssh rahul12@10.50.49.46

# If SSH fails, check:
# 1. Server IP is correct (10.50.49.46)
# 2. Server is running and accessible
# 3. SSH service is running on server
```

### Issue 2: Permission Denied
```bash
# Error: "Permission denied"
# Solution: Use sudo or become
ansible-playbook -i inventory.ini deploy.yml --limit production --ask-become-pass
```

### Issue 3: Docker Installation Failed
```bash
# Check Docker installation manually
ansible -i inventory.ini production -m shell -a "docker --version"

# If Docker not found, install manually:
ssh rahul12@10.50.49.46
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### Issue 4: Containers Not Starting
```bash
# SSH into server
ssh rahul12@10.50.49.46

# Check logs
cd /opt/pms
docker-compose logs

# Restart containers
docker-compose restart

# Rebuild if needed
docker-compose down
docker-compose up -d --build
```

### Issue 5: Health Check Failed
```bash
# Test backend health manually
curl http://10.50.49.46:8082/

# Test frontend
curl http://10.50.49.46/

# Check if ports are listening
sudo netstat -tlnp | grep -E '80|8082|3307'
```

---

## 📦 Post-Deployment Tasks

### 1. Verify Application
```bash
# Check all containers are running
ssh rahul12@10.50.49.46 "cd /opt/pms && docker-compose ps"

# Check logs
ssh rahul12@10.50.49.46 "cd /opt/pms && docker-compose logs --tail=50"
```

### 2. Test Frontend
```bash
# Open in browser
xdg-open http://10.50.49.46    # On Linux
start http://10.50.49.46       # On Windows
```

### 3. Test Backend API
```bash
# Test health endpoint
curl http://10.50.49.46:8082/

# Test auth endpoint
curl -X POST http://10.50.49.46:8082/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123","firstName":"Test","lastName":"User","role":"TENANT"}'
```

### 4. Backup Database
```bash
ssh rahul12@10.50.49.46 "cd /opt/pms && docker-compose exec -T mysql-db mysqldump -u root -pRahul@1606 pmsbackend > backup.sql"
```

---

## 🔄 Update/Redeploy Application

### After Code Changes
```bash
# 1. Commit your changes (on Windows)
cd C:\Users\alexr\PROJECTS\PMS
git add .
git commit -m "Your changes"

# 2. Deploy to production (on WSL)
cd /mnt/c/Users/alexr/PROJECTS/PMS/ansible
ansible-playbook -i inventory.ini deploy.yml --limit production
```

### Quick Backend Update Only
```bash
ssh rahul12@10.50.49.46
cd /opt/pms
docker-compose up -d --build --no-deps backend
```

### Quick Frontend Update Only
```bash
ssh rahul12@10.50.49.46
cd /opt/pms
docker-compose up -d --build --no-deps frontend
```

---

## 🔐 Security Best Practices

### 1. Change Default Passwords
Edit `ansible/vars.yml`:
```yaml
mysql_root_password: "YourStrongPassword@123"
jwt_secret: "your_very_long_random_secret_key_minimum_32_characters"
```

### 2. Use Ansible Vault for Secrets
```bash
# Encrypt sensitive variables
ansible-vault encrypt ansible/vars.yml

# Deploy with vault password
ansible-playbook -i inventory.ini deploy.yml --limit production --ask-vault-pass
```

### 3. Enable Firewall
```bash
ssh rahul12@10.50.49.46
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS (if using SSL)
sudo ufw enable
```

### 4. Use SSH Keys
```bash
# Generate SSH key on WSL
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy to production server
ssh-copy-id rahul12@10.50.49.46

# Update inventory.ini
# Remove ansible_connection=local if using remote SSH
```

---

## 📊 Monitoring

### View Logs in Real-Time
```bash
# All services
ssh rahul12@10.50.49.46 "cd /opt/pms && docker-compose logs -f"

# Specific service
ssh rahul12@10.50.49.46 "cd /opt/pms && docker-compose logs -f backend"
```

### Check Resource Usage
```bash
ssh rahul12@10.50.49.46 "docker stats"
```

### Check Disk Usage
```bash
ssh rahul12@10.50.46 "df -h /opt/pms"
ssh rahul12@10.50.49.46 "docker system df"
```

---

## 🎉 Summary

**You're now ready to deploy!** Here's the quickest path:

```bash
# Open WSL Ubuntu
wsl -d Ubuntu-22.04

# Navigate and deploy
cd /mnt/c/Users/alexr/PROJECTS/PMS/ansible
ansible-playbook -i inventory.ini deploy.yml --limit production
```

**That's it!** Ansible will handle everything automatically. 🚀

---

## 📞 Need Help?

**Check logs**:
```bash
ssh rahul12@10.50.49.46 "cd /opt/pms && docker-compose logs"
```

**Restart services**:
```bash
ssh rahul12@10.50.49.46 "cd /opt/pms && docker-compose restart"
```

**Full cleanup and redeploy**:
```bash
ansible-playbook -i inventory.ini deploy.yml --limit production -e "clean_deployment=true"
```
