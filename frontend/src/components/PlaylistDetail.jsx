import { useState } from 'react';
import VideoCard from './VideoCard';
import VideoPlayer from './VideoPlayer';

const PlaylistDetail = ({ playlist }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!playlist) return null;

  const videos = playlist.videos || [];

  return (
    <div className="bg-indigo-900/30 backdrop-blur-md rounded-xl shadow-lg overflow-hidden mb-6 border border-cyan-500/20 hover:border-cyan-400/40 transition-all">
      <div
        className="p-4 cursor-pointer hover:bg-indigo-900/40 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-cyan-200">
              {playlist.name}
            </h2>
            {playlist.description && (
              <p className="text-purple-200 mt-1">{playlist.description}</p>
            )}
            <p className="text-sm text-cyan-300 mt-2">
              {videos.length} video{videos.length !== 1 ? 's' : ''}
            </p>
          </div>
          <svg
            className={`w-6 h-6 text-cyan-300 transform transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-cyan-500/20 bg-indigo-900/20">
          {videos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-purple-300">No videos in this playlist yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onClick={() => setSelectedVideo(video)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {selectedVideo && (
        <VideoPlayer
          youtubeId={selectedVideo.youtube_id}
          title={selectedVideo.title}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};

export default PlaylistDetail;
