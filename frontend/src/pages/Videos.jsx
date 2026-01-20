import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PlaylistList from '../components/PlaylistList';
import AddVideoForm from '../components/AddVideoForm';

const Videos = () => {
  const { isAdmin } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleVideoAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="p-6 min-h-screen bg-space-gradient">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Videos
          </h1>
          {isAdmin && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-cyan-400 hover:to-purple-500 transition-all flex items-center gap-2 shadow-lg shadow-purple-500/50 hover:shadow-purple-400/70 hover:scale-105 border border-cyan-400/30"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Video
            </button>
          )}
        </div>

        <div key={refreshKey}>
          <PlaylistList />
        </div>

        {showAddForm && (
          <AddVideoForm
            onClose={() => setShowAddForm(false)}
            onSuccess={handleVideoAdded}
          />
        )}
      </div>
    </div>
  );
};

export default Videos;
