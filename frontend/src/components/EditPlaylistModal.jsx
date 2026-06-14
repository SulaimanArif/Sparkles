import { useState } from 'react';
import { playlistsAPI } from '../services/api';
import Portal from './Portal';

const EditPlaylistModal = ({ playlist, onClose, onSuccess }) => {
  const [name, setName] = useState(playlist.name || '');
  const [description, setDescription] = useState(playlist.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name.trim()) {
      setError('Please enter a playlist name');
      setLoading(false);
      return;
    }

    try {
      await playlistsAPI.update(playlist.id, {
        name: name.trim(),
        description: description.trim() || null,
      });
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.name?.[0] ||
        'Failed to update playlist. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
    <div className="fixed inset-0 bg-black bg-opacity-75 z-[200] flex items-center justify-center p-4">
      <div className="bg-indigo-900/40 backdrop-blur-md rounded-2xl max-w-md w-full p-6 border border-cyan-500/30 shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Edit Playlist
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="editName" className="block text-sm font-medium text-cyan-200 mb-2">
              Name
            </label>
            <input
              type="text"
              id="editName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-indigo-900/30 border border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white placeholder-purple-300"
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="editDescription" className="block text-sm font-medium text-cyan-200 mb-2">
              Description
            </label>
            <textarea
              id="editDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-indigo-900/30 border border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white placeholder-purple-300 resize-none"
              disabled={loading}
            />
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
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </Portal>
  );
};

export default EditPlaylistModal;
