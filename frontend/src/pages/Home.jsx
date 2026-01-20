import { useState, useEffect } from 'react';
import { playlistsAPI, videosAPI } from '../services/api';
import VideoCard from '../components/VideoCard';
import VideoPlayer from '../components/VideoPlayer';

const Home = () => {
  const [stats, setStats] = useState({ playlists: 0, videos: 0 });
  const [recentVideos, setRecentVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load playlists count
      const playlistsResponse = await playlistsAPI.getAll();
      const playlists = playlistsResponse.data.results || playlistsResponse.data;
      
      // Load all videos
      const videosResponse = await videosAPI.getAll();
      const videos = videosResponse.data.results || videosResponse.data;
      
      // Sort by added_at and take the 6 most recent
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

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome to Sparkles Video Platform</h1>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <>
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-2">Playlists</h2>
                <p className="text-4xl font-bold">{stats.playlists}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-2">Videos</h2>
                <p className="text-4xl font-bold">{stats.videos}</p>
              </div>
            </div>

            {/* Recent Videos Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Videos</h2>
              {recentVideos.length === 0 ? (
                <p className="text-gray-500">No videos yet. Add some videos to see them here!</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {recentVideos.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      onClick={() => setSelectedVideo(video)}
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
      </div>
    </div>
  );
};

export default Home;
