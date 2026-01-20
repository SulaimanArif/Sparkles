# Fixing Login and Admin 500 Errors on Render

## Issues
1. **500 error on admin login** - Usually means database migrations haven't been run or database issues
2. **Login failed on site** - User doesn't exist or authentication issue

## Quick Fix Steps

### Step 1: Run Migrations

1. Go to Render Dashboard → Your Service → **Shell**
2. Run these commands:

```bash
cd backend
python manage.py migrate
```

This creates all necessary database tables.

### Step 2: Create a Superuser (Admin Account)

In the same Shell, run:

```bash
python manage.py createsuperuser
```

Follow the prompts to create:
- Username
- Email (optional)
- Password

**Important**: Remember these credentials!

### Step 3: Verify Database Setup

The code now automatically supports PostgreSQL if `DATABASE_URL` is set, or SQLite otherwise.

**For SQLite (current setup):**
- Works for single instance
- Data might not persist on Render free tier
- Not recommended for production

**For PostgreSQL (recommended):**
1. Create a PostgreSQL database in Render
2. Copy the **Internal Database URL**
3. Add environment variable:
   ```
   DATABASE_URL=postgresql://user:password@hostname:port/dbname
   ```
4. Redeploy - the app will automatically use PostgreSQL

### Step 4: Test Login

1. **Admin Login**: Go to `https://your-app.onrender.com/admin`
   - Use the superuser credentials you created

2. **Site Login**: Go to `https://your-app.onrender.com/signin`
   - Use the same superuser credentials

## Troubleshooting

### If Migrations Fail

Check the error in Render logs:
- Database connection issues → Check DATABASE_URL
- Permission issues → Database user might not have permissions
- Missing dependencies → Make sure psycopg2-binary is in requirements.txt

### If Superuser Creation Fails

- Make sure migrations ran successfully first
- Check database connection in logs
- Try: `python manage.py createsuperuser --noinput --username admin --email admin@example.com`
  (Then reset password in Django shell)

### If Login Still Fails After Creating User

1. **Check the user exists**:
   ```bash
   python manage.py shell
   >>> from django.contrib.auth.models import User
   >>> User.objects.all()
   ```

2. **Reset password** (in shell):
   ```bash
   python manage.py shell
   >>> from django.contrib.auth.models import User
   >>> u = User.objects.get(username='yourusername')
   >>> u.set_password('newpassword')
   >>> u.save()
   ```

3. **Make user admin**:
   ```bash
   >>> u.is_staff = True
   >>> u.is_superuser = True
   >>> u.save()
   ```

### 500 Error on Admin

Common causes:
1. **Migrations not run** → Run `python manage.py migrate`
2. **Database connection error** → Check DATABASE_URL
3. **Static files missing** → Check that collectstatic ran in build
4. **Missing tables** → Run migrations

Check Render logs for the exact error message.

## Automatic Migration on Deploy

The build script now includes `migrate --noinput` so migrations run automatically on each deploy. However, you still need to:
- Create the initial superuser manually
- Set up PostgreSQL if you want persistent data

## Next Steps

After fixing login:
1. Create playlists through the admin panel
2. Test the video functionality
3. Consider setting up PostgreSQL for production
4. Set up regular backups if using PostgreSQL
