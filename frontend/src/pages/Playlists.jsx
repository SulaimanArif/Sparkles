import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PlaylistList from '../components/PlaylistList';
import AddVideoForm from '../components/AddVideoForm';
import CreatePlaylistModal from '../components/CreatePlaylistModal';

const Playlists = () => {
  const { isAdmin } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="p-6 min-h-screen bg-space-gradient">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Playlists
          </h1>
          {isAdmin && (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowCreatePlaylist(true)}
                className="bg-indigo-900/50 text-cyan-200 px-6 py-2 rounded-lg hover:bg-indigo-900/70 transition-all flex items-center gap-2 border border-cyan-500/30 hover:border-cyan-400/50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Playlist
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-cyan-400 hover:to-purple-500 transition-all flex items-center gap-2 shadow-lg shadow-purple-500/50 hover:shadow-purple-400/70 hover:scale-105 border border-cyan-400/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Add Video
              </button>
            </div>
          )}
        </div>

        <PlaylistList refreshKey={refreshKey} />

        {showAddForm && (
          <AddVideoForm
            onClose={() => setShowAddForm(false)}
            onSuccess={handleRefresh}
          />
        )}

        {showCreatePlaylist && (
          <CreatePlaylistModal
            onClose={() => setShowCreatePlaylist(false)}
            onSuccess={handleRefresh}
          />
        )}
      </div>
    </div>
  );
};

export default Playlists;
