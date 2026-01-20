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
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Videos</h1>
          {isAdmin && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
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
