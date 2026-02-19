# Fix: MongoDB\Client Not Found Error

## The Error

```
Fatal error: Uncaught Error: Class "MongoDB\Client" not found
```

## Quick Fix (Most Likely Solution)

### Step 1: Install Composer Dependencies

The MongoDB library is already in your `composer.json`, but the dependencies need to be installed.

**Option A: Using the Batch File (Easiest)**

1. Navigate to the backend folder
2. Double-click `install_dependencies.bat`
3. Wait for installation to complete

**Option B: Using Command Line**

1. Open Command Prompt
2. Navigate to backend directory:
   ```bash
   cd C:\xampp\htdocs\CAATE-ITRMS\backend
   ```
3. Run:
   ```bash
   composer install
   ```

### Step 2: Verify Installation

Visit: `http://localhost/CAATE-ITRMS/backend/public/check_mongodb.php`

This will show you:

- ✓ If Composer autoloader is found
- ✓ If MongoDB library is installed
- ✓ If MongoDB server is running
- ✓ Connection status

### Step 3: Seed the Database

Once all checks pass, visit:
`http://localhost/CAATE-ITRMS/backend/public/seed.php`

## If Composer is Not Installed

### Install Composer on Windows

1. Download from: https://getcomposer.org/Composer-Setup.exe
2. Run the installer
3. Follow the installation wizard
4. Restart Command Prompt
5. Verify installation:
   ```bash
   composer --version
   ```

## If MongoDB Server is Not Running

### Start MongoDB Server

**Option 1: MongoDB as Windows Service**

```bash
net start MongoDB
```

**Option 2: Start MongoDB Manually**

```bash
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
```

**Option 3: Using MongoDB Compass**

- Open MongoDB Compass
- It will start the server automatically

### Check if MongoDB is Running

Open Command Prompt and run:

```bash
netstat -an | findstr "27017"
```

You should see:

```
TCP    0.0.0.0:27017    0.0.0.0:0    LISTENING
```

## Common Issues

### Issue 1: vendor/autoload.php not found

**Solution:**

```bash
cd C:\xampp\htdocs\CAATE-ITRMS\backend
composer install
```

### Issue 2: Composer command not found

**Solution:**
Install Composer from https://getcomposer.org/download/

### Issue 3: MongoDB connection timeout

**Solution:**

1. Start MongoDB server
2. Check if MongoDB is listening on port 27017
3. Check firewall settings

### Issue 4: Permission denied

**Solution:**
Run Command Prompt as Administrator

## Verification Checklist

- [ ] Composer is installed (`composer --version`)
- [ ] Dependencies are installed (`backend/vendor` folder exists)
- [ ] MongoDB server is running (port 27017 is listening)
- [ ] `check_mongodb.php` shows all green checkmarks
- [ ] Can access seed.php without errors

## Still Having Issues?

1. Check Apache error logs: `C:\xampp\apache\logs\error.log`
2. Check PHP error logs: `C:\xampp\php\logs\php_error_log`
3. Verify PHP version: `C:\xampp\php\php.exe -v`
4. Make sure you're using PHP 7.4 or higher

## Success!

Once everything is working:

1. Visit `http://localhost/CAATE-ITRMS/backend/public/seed.php`
2. Click "Seed Database"
3. Visit `http://localhost/CAATE-ITRMS/admin/src/pages/courses.html`
4. You should see all 10 courses loaded dynamically!
