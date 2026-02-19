# MongoDB Setup Guide for XAMPP (Windows)

## The Error You're Seeing

```
Fatal error: Uncaught Error: Class "MongoDB\Client" not found
```

This means you need to install the MongoDB PHP extension and library.

## Quick Setup (3 Steps)

### Step 1: Install MongoDB PHP Extension

1. **Check your PHP version:**

   ```cmd
   C:\xampp\php\php.exe -v
   ```

   Note the version (e.g., 8.2.12)

2. **Download the extension:**
   - Visit: https://pecl.php.net/package/mongodb/1.17.2/windows
   - Download the file matching your PHP version:
     - For PHP 8.2: `php_mongodb-1.17.2-8.2-ts-vs16-x64.zip`
     - For PHP 8.1: `php_mongodb-1.17.2-8.1-ts-vs16-x64.zip`
     - For PHP 8.0: `php_mongodb-1.17.2-8.0-ts-vs16-x64.zip`

3. **Install the extension:**
   - Extract the ZIP file
   - Copy `php_mongodb.dll` to `C:\xampp\php\ext\`
   - Open `C:\xampp\php\php.ini` (as Administrator)
   - Add this line in the extensions section:
     ```ini
     extension=mongodb
     ```
   - Save and close

4. **Restart Apache:**
   - Open XAMPP Control Panel
   - Stop Apache
   - Start Apache

### Step 2: Install Composer (if not installed)

1. Download from: https://getcomposer.org/Composer-Setup.exe
2. Run the installer
3. Follow the prompts (it will find your PHP automatically)
4. Restart Command Prompt after installation

### Step 3: Install MongoDB PHP Library

1. Open Command Prompt
2. Navigate to backend folder:

   ```cmd
   cd C:\xampp\htdocs\CAATE-ITRMS\backend
   ```

3. Run the setup script:

   ```cmd
   setup.bat
   ```

   OR manually install:

   ```cmd
   composer require mongodb/mongodb
   ```

## Verify Installation

### Test 1: Check Extension is Loaded

```cmd
php -m | findstr mongodb
```

Should output: `mongodb`

### Test 2: Check MongoDB Library

```cmd
cd C:\xampp\htdocs\CAATE-ITRMS\backend
php -r "echo class_exists('MongoDB\Client') ? 'OK' : 'FAIL';"
```

Should output: `OK`

### Test 3: Test Connection

```cmd
php -r "try { $client = new MongoDB\Client('mongodb://localhost:27017'); echo 'Connected!'; } catch (Exception $e) { echo $e->getMessage(); }"
```

Should output: `Connected!`

## Common Issues

### Issue 1: "extension=mongodb" not working

**Solution:**

- Make sure you're editing the correct php.ini
- Check which php.ini is being used:
  ```cmd
  php --ini
  ```
- Edit the "Loaded Configuration File" path shown

### Issue 2: Composer not found

**Solution:**

- Install Composer from: https://getcomposer.org/download/
- After installation, restart Command Prompt
- Verify: `composer --version`

### Issue 3: MongoDB Server not running

**Solution:**

- Download MongoDB Community Server: https://www.mongodb.com/try/download/community
- Install it
- Start MongoDB service:
  ```cmd
  net start MongoDB
  ```

### Issue 4: Wrong PHP version extension

**Solution:**

- Check your PHP version: `php -v`
- Download the EXACT matching extension version
- Make sure it's:
  - **Thread Safe (TS)** for XAMPP
  - **x64** for 64-bit systems
  - **vs16** for Visual Studio 2019

## After Successful Installation

### Seed the Database

**Option 1: Browser**

```
http://localhost/CAATE-ITRMS/backend/public/seed.php
```

**Option 2: Command Line**

```cmd
cd C:\xampp\htdocs\CAATE-ITRMS\backend
php seed_courses.php
```

### View the Courses

```
http://localhost/CAATE-ITRMS/admin/src/pages/courses.html
```

## Still Having Issues?

### Get System Info

Run these commands and share the output:

```cmd
php -v
php -m
php --ini
composer --version
```

### Check MongoDB Status

```cmd
net start | findstr MongoDB
```

### Check Apache Error Log

Open: `C:\xampp\apache\logs\error.log`
Look for recent errors

## Alternative: Use MySQL Instead

If MongoDB is too difficult to set up, you can modify the project to use MySQL (which comes with XAMPP). Let me know if you'd like help with that!

## Need More Help?

Share the output of these commands:

1. `php -v`
2. `php -m | findstr mongodb`
3. `composer --version`
4. Any error messages you see

I'll help you troubleshoot further!
