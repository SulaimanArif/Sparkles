import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { videosAPI } from '../services/api';
import VideoCard from '../components/VideoCard';
import VideoPlayer from '../components/VideoPlayer';
import EditVideoModal from '../components/EditVideoModal';
import AddVideoForm from '../components/AddVideoForm';

const Videos = () => {
  const { isAdmin } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const response = await videosAPI.getAll();
      const data = response.data.results || response.data;
      const sorted = [...data].sort(
        (a, b) => new Date(a.added_at) - new Date(b.added_at)
      );
      setVideos(sorted);
    } catch (err) {
      console.error('Failed to load videos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, [refreshKey]);

  const filteredVideos = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return videos;

    return videos.filter(
      (video) =>
        (video.title || '').toLowerCase().includes(query) ||
        (video.playlist_name || '').toLowerCase().includes(query)
    );
  }, [videos, searchQuery]);

  const handleDeleteVideo = async (video) => {
    try {
      await videosAPI.delete(video.id);
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      alert('Failed to delete video. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-space-gradient">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Videos
          </h1>
          {isAdmin && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-cyan-400 hover:to-purple-500 transition-all flex items-center gap-2 shadow-lg shadow-purple-500/50 hover:shadow-purple-400/70 hover:scale-105 border border-cyan-400/30 self-start"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Add Video
            </button>
          )}
        </div>

        <div className="mb-6">
          <div className="relative max-w-xl">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or playlist..."
              className="w-full pl-10 pr-4 py-3 bg-indigo-900/30 border border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white placeholder-purple-300"
            />
          </div>
          {!loading && searchQuery.trim() && (
            <p className="mt-2 text-sm text-purple-300">
              {filteredVideos.length} result{filteredVideos.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-cyan-400 border-r-purple-500"></div>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center py-12 bg-indigo-900/20 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-8">
            <p className="text-purple-200 text-lg">
              {searchQuery.trim()
                ? 'No videos match your search.'
                : 'No videos yet. Add some videos to get started!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onClick={() => setSelectedVideo(video)}
                showMenu={isAdmin}
                onEdit={setEditingVideo}
                onDelete={handleDeleteVideo}
              />
            ))}
          </div>
        )}

        {selectedVideo && (
          <VideoPlayer
            youtubeId={selectedVideo.youtube_id}
            title={selectedVideo.title}
            onClose={() => setSelectedVideo(null)}
          />
        )}

        {editingVideo && (
          <EditVideoModal
            video={editingVideo}
            onClose={() => setEditingVideo(null)}
            onSuccess={() => {
              setEditingVideo(null);
              setRefreshKey((prev) => prev + 1);
            }}
          />
        )}

        {showAddForm && (
          <AddVideoForm
            onClose={() => setShowAddForm(false)}
            onSuccess={() => setRefreshKey((prev) => prev + 1)}
          />
        )}
      </div>
    </div>
  );
};

export default Videos;
