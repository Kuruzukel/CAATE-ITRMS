# Quick Start: Seed Competencies

## 🚀 Fastest Way to Seed Competencies

### Windows Users (Easiest):

1. Open Command Prompt or PowerShell
2. Navigate to the backend folder:
   ```bash
   cd backend
   ```
3. Run the batch file:
   ```bash
   seed_and_verify_competencies.bat
   ```

That's it! The script will:

- ✅ Check PHP installation
- ✅ Verify MongoDB connection
- ✅ Seed all 121 competencies
- ✅ Verify the data was inserted correctly
- ✅ Show you a summary

---

## 📋 Manual Method

If you prefer to run commands manually:

### Step 1: Seed the Data

```bash
cd backend
php seed_competencies.php
```

### Step 2: Verify the Data

```bash
php verify_competencies.php
```

---

## 🔍 What Gets Added

The script adds **121 competencies** across **10 courses**:

| Course                                 | Competencies |
| -------------------------------------- | ------------ |
| Beauty Care (Nail Care) NC II          | 11           |
| Beauty Care (Skin Care) NC II          | 16           |
| Aesthetic Services Level III           | 17           |
| Advanced Skin Care Services Level III  | 18           |
| Permanent Make-Up Tattoo Level III     | 17           |
| Collagen Induction Therapy             | 2            |
| Advanced Facial Treatment              | 2            |
| Light & Heat Therapy                   | 4            |
| Trainers Methodology Level I           | 18           |
| Eyelash and Eyebrow Services Level III | 16           |

---

## 📊 Database Structure

Each competency is stored as:

```json
{
  "_id": ObjectId("..."),
  "course_code": "NC II - SOCBCN220",
  "course_title": "Beauty Care (Nail Care) Services NC II",
  "competency_type": "Basic",
  "competency_name": "Participate in workplace communication",
  "created_at": ISODate("2024-01-01T00:00:00.000Z"),
  "updated_at": ISODate("2024-01-01T00:00:00.000Z")
}
```

---

## ⚠️ Important Notes

1. **The script will DELETE existing competencies** before inserting new ones
2. Make sure MongoDB is running before executing
3. The course codes must match those in your `courses` collection

---

## 🔧 Troubleshooting

### "MongoDB connection failed"

- Start MongoDB: `mongod` or check your MongoDB service
- Verify connection settings in `backend/.env`

### "PHP is not installed"

- Install PHP from https://www.php.net/downloads
- Add PHP to your system PATH

### "MongoDB extension not found"

```bash
pecl install mongodb
```

---

## 📖 Additional Resources

- **Full Documentation:** See `SEED_COMPETENCIES_README.md`
- **Complete List:** See `COMPETENCIES_LIST.md` for all 121 competencies
- **Verification Script:** Run `php verify_competencies.php` anytime

---

## ✅ Success Indicators

After running, you should see:

```
✓ Inserted: [Basic] Participate in workplace communication - Beauty Care (Nail Care) Services NC II
✓ Inserted: [Common] Maintain an effective relationship with clients/customers - ...
✓ Inserted: [Core] Perform manicure and pedicure - ...
...
========================================
Seeding completed successfully!
Total competencies inserted: 121
========================================
```

---

## 🎯 Next Steps

After seeding:

1. View data in MongoDB Compass
2. Create API endpoints to fetch competencies
3. Display them in your admin/trainee interfaces
4. Link to student progress tracking
