# Sparkles Video Platform

A full-stack web application built with Django REST Framework backend and React frontend for managing and displaying YouTube videos organized into playlists.

## Features

- 🎥 YouTube video management
- 📚 Organize videos into playlists
- 🔍 Browse and search videos
- 📱 Responsive design
- ⚡ Fast and modern UI

## Tech Stack

- **Backend**: Django 5.x + Django REST Framework
- **Frontend**: React 18+ with React Router
- **Database**: SQLite
- **Styling**: Tailwind CSS

## Project Structure

```
project-root/
├── backend/              # Django project
│   ├── api/             # Django app for API endpoints
│   ├── config/          # Django settings
│   ├── manage.py
│   └── requirements.txt
└── frontend/            # React app
    ├── src/
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   ├── services/    # API service layer
    │   └── App.jsx
    ├── package.json
    └── vite.config.js
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Create a superuser (optional, for admin access):
```bash
python manage.py createsuperuser
```

6. Start the development server:
```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Playlists
- `GET /api/playlists/` - List all playlists
- `GET /api/playlists/{id}/` - Get single playlist with videos
- `POST /api/playlists/` - Create new playlist
- `PUT /api/playlists/{id}/` - Update playlist
- `DELETE /api/playlists/{id}/` - Delete playlist

### Videos
- `GET /api/videos/` - List all videos
- `GET /api/videos/{id}/` - Get single video
- `POST /api/videos/` - Add new video (accepts YouTube URL)
- `PUT /api/videos/{id}/` - Update video
- `DELETE /api/videos/{id}/` - Delete video

## Supported YouTube URL Formats

The application supports various YouTube URL formats:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://m.youtube.com/watch?v=VIDEO_ID`

## Usage

### Development Mode (Separate Servers)

1. Start the backend server:
```bash
cd backend
python manage.py runserver
```

2. Start the frontend server (in a new terminal):
```bash
cd frontend
npm run dev
```

3. Access the application at `http://localhost:5173`

### Production Mode (Single Server)

The application can be served entirely from Django:

1. Build the React frontend and collect static files:
```bash
# Windows
build.bat

# macOS/Linux
chmod +x build.sh
./build.sh
```

2. Start the Django server:
```bash
cd backend
python manage.py runserver
```

3. Access everything at `http://localhost:8000`
   - Frontend: `http://localhost:8000`
   - Admin panel: `http://localhost:8000/admin`
   - API: `http://localhost:8000/api`

## Usage Instructions

1. Create playlists using the Django admin panel or API
2. Add videos by clicking "Add Video" (admin only) and entering a YouTube URL
3. Click on any video thumbnail to play it in a modal player

## Development

### Backend
- Admin panel: `http://localhost:8000/admin`
- API root: `http://localhost:8000/api/`

### Frontend
- Development server: `http://localhost:5173` (when running separately)
- Hot module replacement enabled in dev mode

## License

MIT
