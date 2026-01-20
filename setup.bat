@echo off
echo Setting up Sparkles Video Platform...

echo Setting up Django backend...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
echo Backend setup complete!
cd ..

echo Setting up React frontend...
cd frontend
npm install
echo Frontend setup complete!
cd ..

echo.
echo Setup complete! To start the application:
echo.
echo Backend (in one terminal):
echo   cd backend
echo   venv\Scripts\activate
echo   python manage.py runserver
echo.
echo Frontend (in another terminal):
echo   cd frontend
echo   npm run dev
echo.
