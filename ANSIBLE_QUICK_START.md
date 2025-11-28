# 🚀 Ansible Quick Start - PMS Deployment

## One-Command Deploy

```bash
# 1. Open WSL Ubuntu
wsl -d Ubuntu-22.04

# 2. Navigate to ansible directory
cd /mnt/c/Users/alexr/PROJECTS/PMS/ansible

# 3. Deploy to production
ansible-playbook -i inventory.ini deploy.yml --limit production
```

## Pre-Flight Check

```bash
# Test connection
ansible -i inventory.ini production -m ping

# Expected: 10.50.49.46 | SUCCESS => { "ping": "pong" }
```

## Common Commands

```bash
# Deploy to production (10.50.49.46)
ansible-playbook -i inventory.ini deploy.yml --limit production

# Deploy to localhost
ansible-playbook -i inventory.ini deploy.yml --limit local

# Dry run (what would change)
ansible-playbook -i inventory.ini deploy.yml --limit production --check

# Verbose output (for debugging)
ansible-playbook -i inventory.ini deploy.yml --limit production -vvv

# Clean deployment (remove old data)
ansible-playbook -i inventory.ini deploy.yml --limit production -e "clean_deployment=true"
```

## Deployment Timeline

- **Phase 1**: Pre-deployment checks (2-3 min)
- **Phase 2**: Docker installation (3-5 min)
- **Phase 3**: Application deployment (3-5 min)
- **Phase 4**: Health checks (2-3 min)
- **Total**: ~10-15 minutes (first time), ~5 minutes (updates)

## What Gets Deployed

✅ Docker & Docker Compose installed
✅ Application copied to `/opt/pms`
✅ Containers built and started
✅ MySQL on port 3307
✅ Backend on port 8082
✅ Frontend on port 80

## Access URLs (After Deployment)

- **Frontend**: http://10.50.49.46
- **Backend API**: http://10.50.49.46:8082/api
- **MySQL**: 10.50.49.46:3307

## Verification

```bash
# Check deployment status
ssh rahul12@10.50.49.46 "cd /opt/pms && docker-compose ps"

# View logs
ssh rahul12@10.50.49.46 "cd /opt/pms && docker-compose logs -f"

# Test frontend
curl http://10.50.49.46/

# Test backend
curl http://10.50.49.46:8082/
```

## Troubleshooting

```bash
# If connection fails
ssh rahul12@10.50.49.46

# If containers fail
ssh rahul12@10.50.49.46
cd /opt/pms
docker-compose logs
docker-compose restart

# Re-run deployment
ansible-playbook -i inventory.ini deploy.yml --limit production
```

## Update After Code Changes

```bash
# On Windows: commit changes
cd C:\Users\alexr\PROJECTS\PMS
git add .
git commit -m "Update"

# On WSL: redeploy
cd /mnt/c/Users/alexr/PROJECTS/PMS/ansible
ansible-playbook -i inventory.ini deploy.yml --limit production
```

---

**Full Documentation**: See `ANSIBLE_DEPLOYMENT_GUIDE.md`
