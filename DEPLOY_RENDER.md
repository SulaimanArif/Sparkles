# Deploying to Render

This guide will help you deploy the Sparkles Video Platform to Render.

## Prerequisites

1. A Render account (sign up at [render.com](https://render.com))
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Prepare Your Repository

Make sure your code is committed and pushed to your Git repository:

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

## Step 2: Create a New Web Service on Render

1. Go to your [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** and select **"Web Service"**
3. Connect your repository
4. Select the repository containing this project

## Step 3: Configure the Web Service

### Basic Settings

- **Name**: `sparkles-video-platform` (or your preferred name)
- **Environment**: `Python 3`
- **Region**: Choose the closest region to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave empty (Render will use the repository root)

### Build Command

Use this build command (Render runs from repository root):

```bash
pip install --upgrade pip && pip install -r backend/requirements.txt && npm install --prefix frontend && npm run build --prefix frontend && python backend/manage.py collectstatic --noinput
```

**Alternative Build Command (if above doesn't work):**

```bash
pip install --upgrade pip && pip install -r backend/requirements.txt && cd frontend && npm install && npm run build && cd .. && python backend/manage.py collectstatic --noinput
```

**Or use the build script (recommended):**

The simplest approach is to use the provided `build.sh` script. In Render, set the build command to:

```bash
chmod +x build.sh && ./build.sh
```

Make sure `build.sh` is in your repository root and committed to Git.

### Start Command

```bash
cd backend && gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
```

**Note**: Render automatically sets the `$PORT` environment variable, so we bind to that port.

## Step 4: Environment Variables

Add these environment variables in the Render dashboard under **"Environment"**:

### Required Variables

```
SECRET_KEY=your-secret-key-here-generate-a-long-random-string
DEBUG=False
ALLOWED_HOSTS=your-app-name.onrender.com
```

### Optional Variables

```
DJANGO_SETTINGS_MODULE=config.settings
PYTHON_VERSION=3.12.0
```

### Generate SECRET_KEY

You can generate a secret key using Python:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

## Step 5: Database Setup

### Option A: Use Render PostgreSQL (Recommended)

1. Create a new **PostgreSQL** database in Render
2. Copy the **Internal Database URL**
3. Add environment variable:

```
DATABASE_URL=postgresql://user:password@hostname:port/dbname
```

4. Update `backend/config/settings.py` to use PostgreSQL:

```python
import os
import dj_database_url

# Database
DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL'),
        conn_max_age=600,
        conn_health_checks=True,
    )
}
```

5. Add `dj-database-url` and `psycopg2-binary` to `backend/requirements.txt`:

```
dj-database-url==2.1.0
psycopg2-binary==2.9.9
```

6. Run migrations after deployment:
   - In Render dashboard, go to your service
   - Click "Shell" or use Render CLI
   - Run: `python manage.py migrate`

### Option B: Use SQLite (Simple, but not recommended for production)

If you want to keep SQLite for simplicity, no database setup needed. However, SQLite on Render may have issues with multiple instances and doesn't persist data well.

## Step 6: Static Files Configuration

### Update settings.py for Production

Add this to your `backend/config/settings.py`:

```python
# Static files configuration for production
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# For Render
if not DEBUG:
    STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
    STATICFILES_DIRS = []
    if (BASE_DIR.parent / 'frontend' / 'dist').exists():
        STATICFILES_DIRS.append(BASE_DIR.parent / 'frontend' / 'dist')
```

### Install WhiteNoise (Recommended)

Add to `backend/requirements.txt`:

```
whitenoise==6.6.0
```

Update `backend/config/settings.py` middleware:

```python
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Add this
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# WhiteNoise configuration
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
```

## Step 7: Update requirements.txt

Make sure your `backend/requirements.txt` includes:

```
Django==5.0.1
djangorestframework==3.14.0
django-cors-headers==4.3.1
gunicorn==21.2.0
whitenoise==6.6.0
```

If using PostgreSQL:
```
dj-database-url==2.1.0
psycopg2-binary==2.9.9
```

## Step 8: Create runtime.txt (Optional)

Create `backend/runtime.txt` to specify Python version:

```
python-3.12.0
```

Or create it at the project root if needed.

## Step 9: Update ALLOWED_HOSTS

Update `backend/config/settings.py`:

```python
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',') if os.environ.get('ALLOWED_HOSTS') else ['localhost', '127.0.0.1']
```

Or set it directly:

```python
ALLOWED_HOSTS = ['your-app-name.onrender.com']
```

## Step 10: Deploy

1. Click **"Create Web Service"** in Render
2. Wait for the build to complete (this may take several minutes)
3. Once deployed, your app will be available at: `https://your-app-name.onrender.com`

## Step 11: Run Initial Setup

After the first deployment, you may need to:

1. **Create a superuser** (admin account):
   - Go to Render dashboard → Your service → "Shell"
   - Run: `python manage.py createsuperuser`

2. **Run migrations** (if using a new database):
   - In Shell: `python manage.py migrate`

## Step 12: Create Playlists (Optional)

Since the API requires authentication, you'll need to:
1. Log in through the admin panel: `https://your-app-name.onrender.com/admin`
2. Create playlists manually, or
3. Create an API endpoint that doesn't require authentication for initial setup (development only)

## Troubleshooting

### Build Fails

- Check the build logs in Render dashboard
- Ensure `package.json` exists in `frontend/` directory
- Verify Node.js is available in the build environment

### Static Files Not Loading

- Make sure `collectstatic` runs in the build command
- Check that WhiteNoise is configured correctly
- Verify STATIC_ROOT is set correctly

### Database Errors

- Ensure DATABASE_URL is set correctly
- Check that migrations have been run
- Verify PostgreSQL connection string format

### 404 Errors on React Routes

- Ensure the catch-all route is configured in `urls.py`
- Check that `index.html` is being served for all non-API routes

### CORS Errors

- Update `CORS_ALLOWED_ORIGINS` in settings.py to include your Render domain
- Or set `CORS_ALLOW_ALL_ORIGINS = True` for development (not recommended for production)

## Custom Domain (Optional)

1. In Render dashboard, go to your service
2. Click **"Settings"** → **"Custom Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions

## Auto-Deploy

Render automatically deploys when you push to your connected branch. You can disable this in settings if needed.

## Monitoring

- View logs in the Render dashboard
- Set up health checks if needed
- Monitor resource usage

## Cost

Render offers a free tier with limitations:
- Web services sleep after 15 minutes of inactivity (free tier)
- PostgreSQL has a 90-day free trial
- Upgrade to paid plans for always-on services

---

**Note**: For production use, make sure to:
- Set `DEBUG=False`
- Use a strong `SECRET_KEY`
- Configure proper security headers
- Use a production database (PostgreSQL)
- Set up proper backup strategies
