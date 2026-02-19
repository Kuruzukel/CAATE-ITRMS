# Installing MongoDB PHP Extension for XAMPP (Windows)

## Error

```
Fatal error: Uncaught Error: Class "MongoDB\Client" not found
```

This means the MongoDB PHP extension is not installed or not enabled.

## Solution: Install MongoDB Extension

### Step 1: Check Your PHP Version

1. Open Command Prompt
2. Run:
   ```cmd
   C:\xampp\php\php.exe -v
   ```
3. Note your PHP version (e.g., PHP 8.2.x)

### Step 2: Download MongoDB Extension

1. Visit: https://pecl.php.net/package/mongodb
2. Click on "DLL" link next to the latest stable version
3. Or direct link: https://windows.php.net/downloads/pecl/releases/mongodb/

4. Download the correct version based on your PHP:
   - **PHP 8.2**: `php_mongodb-1.17.2-8.2-ts-vs16-x64.zip` (Thread Safe)
   - **PHP 8.1**: `php_mongodb-1.17.2-8.1-ts-vs16-x64.zip`
   - **PHP 8.0**: `php_mongodb-1.17.2-8.0-ts-vs16-x64.zip`

   Choose:
   - **x64** (64-bit) - Most common
   - **ts** (Thread Safe) - For XAMPP
   - **vs16** (Visual Studio 2019)

### Step 3: Install the Extension

1. Extract the downloaded ZIP file
2. Copy `php_mongodb.dll` to: `C:\xampp\php\ext\`
3. Open `C:\xampp\php\php.ini` in a text editor (as Administrator)
4. Find the section with other extensions (search for `extension=`)
5. Add this line:
   ```ini
   extension=mongodb
   ```
6. Save the file

### Step 4: Restart Apache

1. Open XAMPP Control Panel
2. Stop Apache
3. Start Apache again

### Step 5: Verify Installation

1. Create a test file: `C:\xampp\htdocs\test_mongodb.php`

   ```php
   <?php
   phpinfo();
   ?>
   ```

2. Open in browser: `http://localhost/test_mongodb.php`
3. Search for "mongodb" on the page
4. You should see a MongoDB section with version info

### Step 6: Install Composer Dependencies

The MongoDB PHP Library also needs to be installed via Composer:

1. Open Command Prompt in your project backend folder:

   ```cmd
   cd C:\xampp\htdocs\CAATE-ITRMS\backend
   ```

2. If you don't have `composer.json`, create it:

   ```cmd
   composer init
   ```

   (Press Enter for all prompts to use defaults)

3. Install MongoDB library:
   ```cmd
   composer require mongodb/mongodb
   ```

### Step 7: Update Your Code (If Needed)

Make sure your `database.php` has the correct autoload:

```php
<?php
// Load Composer autoloader
require_once __DIR__ . '/../../vendor/autoload.php';

function getMongoConnection() {
    try {
        $client = new MongoDB\Client("mongodb://localhost:27017");
        return $client->caate_db;
    } catch (Exception $e) {
        die("MongoDB Connection Error: " . $e->getMessage());
    }
}
```

## Alternative: Quick Fix Without Composer

If you can't use Composer, download the MongoDB PHP Library manually:

1. Download from: https://github.com/mongodb/mongo-php-library/releases
2. Extract to: `C:\xampp\htdocs\CAATE-ITRMS\backend\vendor\mongodb\mongodb\`
3. Update your `database.php` to manually include files

## Troubleshooting

### Extension not loading?

- Check `php.ini` path: Run `php --ini` to see which php.ini is being used
- Make sure you edited the correct php.ini (XAMPP uses `C:\xampp\php\php.ini`)
- Check Apache error logs: `C:\xampp\apache\logs\error.log`

### Wrong PHP version?

- Download the extension matching your exact PHP version
- Check both Thread Safe (TS) vs Non-Thread Safe (NTS)
- XAMPP typically uses Thread Safe

### Still not working?

1. Restart your computer
2. Check if MongoDB server is running
3. Try running: `php -m | findstr mongodb` to see if extension is loaded

## Quick Test After Installation

Run this in Command Prompt:

```cmd
cd C:\xampp\htdocs\CAATE-ITRMS\backend
php seed_courses.php
```

If successful, you'll see:

```
Clearing existing courses...
Inserting courses...
✓ Inserted: Beauty Care (Nail Care) Services NC II
...
```

## Need Help?

If you're still having issues:

1. Check your PHP version: `php -v`
2. Check loaded extensions: `php -m`
3. Check php.ini location: `php --ini`
4. Share the output and I can help further!
