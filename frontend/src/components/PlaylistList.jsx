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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-cyan-400 border-r-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg backdrop-blur-sm">
        {error}
      </div>
    );
  }

  if (playlists.length === 0) {
    return (
      <div className="text-center py-12 bg-indigo-900/20 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-8">
        <p className="text-purple-200 text-lg">No playlists yet. Create one to get started!</p>
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
