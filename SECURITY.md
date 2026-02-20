# Security Guidelines

## Sensitive Data Protection

This project uses `.gitignore` to prevent sensitive data from being committed to the repository.

### Files That Are Ignored

The following types of files are automatically ignored:

1. **Environment Variables**
   - `.env` files (except `.env.example`)
   - Any file ending with `.env`

2. **Credentials & API Keys**
   - `credentials.json`
   - `secrets.json`
   - `api-keys.json`
   - `*.key`, `*.pem`, `*.p12`, `*.pfx`

3. **Configuration Files**
   - `config.local.php`
   - `config.production.php`
   - `mail.config.php`
   - `email.config.php`
   - `smtp.config.php`
   - `auth.config.php`
   - `session.config.php`
   - `jwt.secret`
   - `oauth.config.php`

4. **Database Files**
   - `*.sql`, `*.sql.gz`, `*.dump`
   - `backup/`, `backups/`

5. **Log Files**
   - `*.log`
   - `logs/`, `storage/logs/`

6. **User Uploads**
   - `uploads/`, `storage/uploads/`, `public/uploads/`

## Best Practices

### 1. Use Environment Variables

Always use environment variables for sensitive configuration:

```php
// ✅ GOOD - Uses environment variables
define('DB_PASSWORD', getenv('DB_PASSWORD') ?: '');

// ❌ BAD - Hardcoded password
define('DB_PASSWORD', 'mypassword123');
```

### 2. Never Commit Sensitive Data

Before committing, check for sensitive data:

```bash
# Check what files will be committed
git status

# Check file contents before adding
git diff

# If you accidentally added a sensitive file
git reset HEAD <file>
```

### 3. Use .env.example as Template

The `.env.example` file shows what environment variables are needed without exposing actual values:

```
# .env.example (safe to commit)
DB_HOST=127.0.0.1
DB_PORT=27017
DB_NAME=CAATE-ITRMS
DB_USERNAME=
DB_PASSWORD=
```

### 4. Change Default Passwords

Always change default passwords in production:

- Default admin password: `admin123` (change immediately!)
- Database passwords should be strong and unique
- Use password managers to generate secure passwords

### 5. Secure API Keys

If using external APIs:

- Store API keys in environment variables
- Never log API keys
- Rotate keys regularly
- Use different keys for development and production

## What to Do If You Accidentally Commit Sensitive Data

### 1. Remove from Latest Commit

```bash
# Remove file from git but keep it locally
git rm --cached <file>

# Commit the removal
git commit -m "Remove sensitive file"

# Push changes
git push
```

### 2. Remove from Git History

If the sensitive data is in git history:

```bash
# Use git filter-branch or BFG Repo-Cleaner
# WARNING: This rewrites history!

# Example with git filter-branch
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch <file>" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (be careful!)
git push origin --force --all
```

### 3. Rotate Compromised Credentials

If passwords or API keys were exposed:

1. Change all affected passwords immediately
2. Rotate API keys
3. Review access logs for unauthorized access
4. Notify relevant parties if required

## Checking for Sensitive Data

Before committing, you can search for potential sensitive data:

```bash
# Search for common sensitive patterns
git diff | grep -i "password\|api_key\|secret\|token"

# Check staged files
git diff --cached | grep -i "password\|api_key\|secret\|token"
```

## Production Deployment

### Environment Variables

Set environment variables on your production server:

**Apache (.htaccess or VirtualHost):**

```apache
SetEnv DB_PASSWORD "your_secure_password"
SetEnv API_KEY "your_api_key"
```

**Nginx (with PHP-FPM):**

```nginx
fastcgi_param DB_PASSWORD "your_secure_password";
fastcgi_param API_KEY "your_api_key";
```

**Docker:**

```yaml
environment:
  - DB_PASSWORD=your_secure_password
  - API_KEY=your_api_key
```

### File Permissions

Ensure proper file permissions on production:

```bash
# Configuration files should not be world-readable
chmod 600 .env
chmod 600 config/*.php

# Directories should not be world-writable
chmod 755 storage/
chmod 755 uploads/
```

## Security Checklist

- [ ] `.gitignore` is properly configured
- [ ] No `.env` files are committed
- [ ] Default passwords are changed
- [ ] Environment variables are used for sensitive data
- [ ] API keys are stored securely
- [ ] Database credentials are not hardcoded
- [ ] Log files don't contain sensitive information
- [ ] File permissions are properly set in production
- [ ] HTTPS is enabled in production
- [ ] Regular security updates are applied

## Reporting Security Issues

If you discover a security vulnerability, please email: security@caate.edu

Do not create public GitHub issues for security vulnerabilities.
