@echo off
echo Building React frontend...
cd frontend
call npm run build

echo.
echo Collecting Django static files...
cd ..\backend
python manage.py collectstatic --noinput

echo.
echo Build complete! Now run: python manage.py runserver
echo The application will be available at http://localhost:8000
