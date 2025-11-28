# GitHub Secrets Configuration Guide

This file lists all the secrets you need to configure in your GitHub repository for CI/CD pipeline.

## How to Add Secrets

1. Go to your GitHub repository
2. Click on **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Add each secret below

---

## Required Secrets

### SSH Configuration (for deployment)

**SSH_PRIVATE_KEY**
- Description: Private SSH key to access your server
- How to get:
  ```bash
  # Generate SSH key if you don't have one
  ssh-keygen -t rsa -b 4096 -C "github-actions"
  
  # Copy private key content
  cat ~/.ssh/id_rsa
  ```
- Paste the entire content including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`

**SERVER_HOST**
- Description: Your server IP address or domain
- Example: `123.45.67.89` or `server.example.com`

**SERVER_USER** (optional, defaults to ansible inventory)
- Description: SSH username
- Example: `ubuntu` or `root`

---

### Database Configuration

**MYSQL_ROOT_PASSWORD**
- Description: MySQL root password
- Example: `YourSecurePassword123!`
- Requirements: Use a strong password (min 16 characters, mixed case, numbers, symbols)

---

### Cloudinary Configuration (Optional - for image storage)

**CLOUDINARY_CLOUD_NAME**
- Description: Your Cloudinary cloud name
- Get from: https://cloudinary.com/console
- Example: `your-cloud-name`

**CLOUDINARY_API_KEY**
- Description: Cloudinary API key
- Get from: https://cloudinary.com/console
- Example: `123456789012345`

**CLOUDINARY_API_SECRET**
- Description: Cloudinary API secret
- Get from: https://cloudinary.com/console
- Example: `abcdefghijklmnopqrstuvwxyz123456`

---

### Razorpay Configuration (Optional - for payments)

**RAZORPAY_KEY_ID**
- Description: Razorpay API key ID
- Get from: https://dashboard.razorpay.com/app/keys
- Example: `rzp_test_1234567890abcd`

**RAZORPAY_KEY_SECRET**
- Description: Razorpay API key secret
- Get from: https://dashboard.razorpay.com/app/keys
- Example: `abcdefghijklmnopqrstuvwxyz123456`

---

### JWT Configuration (Optional)

**JWT_SECRET**
- Description: Secret key for JWT token generation
- Generate: 
  ```bash
  openssl rand -base64 32
  ```
- Example: `your_jwt_secret_key_minimum_32_characters_long`

---

## Optional Secrets

### Docker Registry (if using private registry)

**DOCKER_USERNAME**
- Description: Docker Hub username or private registry username
- Example: `yourusername`

**DOCKER_PASSWORD**
- Description: Docker Hub password or private registry password
- Example: `your-password`

**DOCKER_REGISTRY**
- Description: Custom Docker registry URL
- Example: `registry.example.com`
- Default: `ghcr.io` (GitHub Container Registry)

---

### Slack/Discord Notifications (Optional)

**SLACK_WEBHOOK_URL**
- Description: Slack webhook URL for deployment notifications
- Get from: https://api.slack.com/messaging/webhooks
- Example: `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX`

**DISCORD_WEBHOOK_URL**
- Description: Discord webhook URL for deployment notifications
- Get from: Discord Server Settings > Integrations > Webhooks
- Example: `https://discord.com/api/webhooks/123456789/abcdefghijklmnopqrstuvwxyz`

---

## Verification

After adding all secrets, verify they're correctly configured:

```bash
# Check if workflow can access secrets
# Push a commit and check the Actions tab

# Or manually trigger workflow
# Go to Actions > Select workflow > Run workflow
```

---

## Security Best Practices

1. **Never commit secrets to Git**
   - Use `.env.example` for templates
   - Add `.env` to `.gitignore`

2. **Rotate secrets regularly**
   - Change passwords every 90 days
   - Update API keys when necessary

3. **Use different secrets for each environment**
   - Development: Use test/demo keys
   - Staging: Use staging credentials
   - Production: Use production credentials

4. **Limit secret access**
   - Only add secrets that are needed
   - Use environment-specific secrets when possible

5. **Monitor secret usage**
   - Check GitHub Actions logs regularly
   - Review failed deployments

---

## Troubleshooting

### Secret not working
- Check secret name matches exactly (case-sensitive)
- Verify secret value has no extra spaces or newlines
- Re-add the secret if in doubt

### SSH connection failed
- Verify SSH key format (should be private key, not public)
- Check server firewall allows connection from GitHub IPs
- Verify `SERVER_HOST` is correct

### Deployment fails
- Check all required secrets are added
- Verify secret values are correct
- Check GitHub Actions logs for specific error

---

**Note**: Keep this file updated when adding new secrets or changing requirements.
