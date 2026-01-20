import { useState, useEffect } from 'react';
import { playlistsAPI, videosAPI } from '../services/api';

const AddVideoForm = ({ onClose, onSuccess }) => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingPlaylists, setLoadingPlaylists] = useState(true);

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      setLoadingPlaylists(true);
      const response = await playlistsAPI.getAll();
      setPlaylists(response.data.results || response.data);
      if (response.data.results?.length > 0 || response.data.length > 0) {
        setSelectedPlaylist((response.data.results || response.data)[0].id.toString());
      }
    } catch (err) {
      setError('Failed to load playlists');
    } finally {
      setLoadingPlaylists(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!youtubeUrl.trim()) {
      setError('Please enter a YouTube URL');
      setLoading(false);
      return;
    }

    if (!selectedPlaylist) {
      setError('Please select a playlist');
      setLoading(false);
      return;
    }

    try {
      await videosAPI.create({
        youtube_url: youtubeUrl.trim(),
        playlist: parseInt(selectedPlaylist),
        title: '', // Title will be auto-generated from YouTube ID
      });

      setYoutubeUrl('');
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.youtube_url?.[0] ||
        'Failed to add video. Please check the URL and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-indigo-900/40 backdrop-blur-md rounded-2xl max-w-md w-full p-6 border border-cyan-500/30 shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Add Video
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="youtubeUrl" className="block text-sm font-medium text-cyan-200 mb-2">
              YouTube URL
            </label>
            <input
              type="url"
              id="youtubeUrl"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-3 py-2 bg-indigo-900/30 border border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white placeholder-purple-300"
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="playlist" className="block text-sm font-medium text-cyan-200 mb-2">
              Playlist
            </label>
            {loadingPlaylists ? (
              <div className="text-purple-300">Loading playlists...</div>
            ) : playlists.length === 0 ? (
              <div className="text-red-300 text-sm bg-red-900/30 p-2 rounded border border-red-500/30">
                No playlists available. Please create a playlist first.
              </div>
            ) : (
              <select
                id="playlist"
                value={selectedPlaylist}
                onChange={(e) => setSelectedPlaylist(e.target.value)}
                className="w-full px-3 py-2 bg-indigo-900/30 border border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white"
                disabled={loading}
              >
                {playlists.map((playlist) => (
                  <option key={playlist.id} value={playlist.id} className="bg-indigo-900">
                    {playlist.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 text-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-cyan-500/30 rounded-lg text-cyan-200 hover:bg-indigo-900/50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg hover:from-cyan-400 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/50"
              disabled={loading || loadingPlaylists || playlists.length === 0}
            >
              {loading ? 'Adding...' : 'Add Video'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVideoForm;
