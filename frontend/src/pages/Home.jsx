import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { playlistsAPI, videosAPI } from '../services/api';
import VideoCard from '../components/VideoCard';
import VideoPlayer from '../components/VideoPlayer';
import EditVideoModal from '../components/EditVideoModal';

const Home = () => {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState({ playlists: 0, videos: 0 });
  const [recentVideos, setRecentVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);

      const playlistsResponse = await playlistsAPI.getAll();
      const playlists = playlistsResponse.data.results || playlistsResponse.data;

      const videosResponse = await videosAPI.getAll();
      const videos = videosResponse.data.results || videosResponse.data;

      const sortedVideos = [...videos]
        .sort((a, b) => new Date(b.added_at) - new Date(a.added_at))
        .slice(0, 6);

      setStats({
        playlists: playlists.length,
        videos: videos.length,
      });
      setRecentVideos(sortedVideos);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteVideo = async (video) => {
    try {
      await videosAPI.delete(video.id);
      loadData();
    } catch (err) {
      alert('Failed to delete video. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-space-gradient">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          From the same star.
        </h1>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-cyan-400 border-r-purple-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-md text-white rounded-xl p-6 shadow-2xl border border-cyan-500/20 hover:border-cyan-400/40 transition-all hover:shadow-cyan-500/20">
                <h2 className="text-2xl font-bold mb-2">Playlists</h2>
                <p className="text-5xl font-bold text-cyan-300">{stats.playlists}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md text-white rounded-xl p-6 shadow-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all hover:shadow-purple-500/20">
                <h2 className="text-2xl font-bold mb-2">Videos</h2>
                <p className="text-5xl font-bold text-purple-300">{stats.videos}</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-cyan-200 mb-6">
                Recent Videos
              </h2>
              {recentVideos.length === 0 ? (
                <div className="bg-indigo-900/20 backdrop-blur-sm rounded-xl p-8 border border-cyan-500/20 text-center">
                  <p className="text-purple-200 text-lg">No videos yet. Add some videos to see them here!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {recentVideos.map((video) => (
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
            </div>
          </>
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
              loadData();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
