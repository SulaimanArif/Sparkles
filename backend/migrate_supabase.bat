@echo off
cd /d "%~dp0"
set DATABASE_URL=
echo Migrating to Supabase...
python manage.py migrate
if errorlevel 1 exit /b 1
echo Loading backup data...
python manage.py loaddata backup.json
if errorlevel 1 exit /b 1
echo Done! Supabase migration complete.
python manage.py shell -c "from api.models import Playlist, Video; from django.contrib.auth.models import User; print(f'Users: {User.objects.count()}, Playlists: {Playlist.objects.count()}, Videos: {Video.objects.count()}')"
