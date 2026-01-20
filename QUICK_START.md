# Quick Start Guide

## To Start the Server:

1. **Make sure React is built:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start Django server:**
   ```bash
   cd backend
   python manage.py runserver
   ```

3. **Access the application:**
   - Open your browser and go to: `http://127.0.0.1:8000/`
   - Or try: `http://localhost:8000/`

## Common Issues:

### Error -102 (Connection Refused)
This means the Django server is not running. Make sure:
- You've started `python manage.py runserver` in the backend directory
- You see a message like: "Starting development server at http://127.0.0.1:8000/"
- No other application is using port 8000

### Assets Not Loading
If the page loads but assets don't:
- Make sure `frontend/dist/` exists
- Make sure `frontend/dist/assets/` contains the JS and CSS files
- Rebuild React: `cd frontend && npm run build`

### Port Already in Use
If port 8000 is busy:
```bash
python manage.py runserver 8001
```
Then access at `http://localhost:8001`
