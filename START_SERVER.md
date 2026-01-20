# Starting the Server

Follow these steps to start the application:

## Step 1: Rebuild React (if needed)

If you made changes to the frontend, rebuild it:

```bash
cd frontend
npm run build
```

## Step 2: Start Django Server

```bash
cd backend
python manage.py runserver
```

## Step 3: Access the Application

Once the server starts, you should see:
```
Starting development server at http://127.0.0.1:8000/
```

Then access:
- Main app: http://127.0.0.1:8000/ or http://localhost:8000/
- Admin panel: http://localhost:8000/admin
- API: http://localhost:8000/api

## Troubleshooting

If you get Error -102 (connection refused):
1. Make sure the Django server is actually running
2. Check if port 8000 is already in use
3. Try accessing http://127.0.0.1:8000 instead of http://localhost:8000
4. Check that the React build exists at `frontend/dist/`

## Verify Build

Make sure you have:
- `frontend/dist/index.html` exists
- `frontend/dist/assets/` directory with JS and CSS files
