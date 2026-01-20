import { useState, useEffect } from 'react';
import { playlistsAPI } from '../services/api';
import PlaylistDetail from './PlaylistDetail';

const PlaylistList = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await playlistsAPI.getAll();
      const playlistData = response.data.results || response.data;
      
      // Load videos for each playlist
      const playlistsWithVideos = await Promise.all(
        playlistData.map(async (playlist) => {
          try {
            const videoResponse = await playlistsAPI.getById(playlist.id);
            return videoResponse.data;
          } catch (err) {
            return { ...playlist, videos: [] };
          }
        })
      );
      
      setPlaylists(playlistsWithVideos);
    } catch (err) {
      setError('Failed to load playlists. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  if (playlists.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No playlists yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div>
      {playlists.map((playlist) => (
        <PlaylistDetail key={playlist.id} playlist={playlist} />
      ))}
    </div>
  );
};

export default PlaylistList;
