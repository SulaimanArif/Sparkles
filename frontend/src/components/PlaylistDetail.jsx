import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { videosAPI, playlistsAPI } from '../services/api';
import VideoCard from './VideoCard';
import VideoPlayer from './VideoPlayer';
import CardMenu from './CardMenu';
import EditVideoModal from './EditVideoModal';
import EditPlaylistModal from './EditPlaylistModal';

const PlaylistDetail = ({ playlist, onRefresh }) => {
  const { isAdmin } = useAuth();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [editingPlaylist, setEditingPlaylist] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!playlist) return null;

  const videos = playlist.videos || [];

  const handleDeleteVideo = async (video) => {
    try {
      await videosAPI.delete(video.id);
      onRefresh?.();
    } catch (err) {
      alert('Failed to delete video. Please try again.');
      console.error(err);
    }
  };

  const handleDeletePlaylist = async () => {
    if (!window.confirm(`Delete playlist "${playlist.name}" and all its videos?`)) return;

    try {
      await playlistsAPI.delete(playlist.id);
      onRefresh?.();
    } catch (err) {
      alert('Failed to delete playlist. Please try again.');
      console.error(err);
    }
  };

  const playlistMenuItems = isAdmin
    ? [
        { label: 'Edit', onClick: () => setEditingPlaylist(true) },
        { label: 'Delete', danger: true, onClick: handleDeletePlaylist },
      ]
    : [];

  return (
    <div className="bg-indigo-900/30 backdrop-blur-md rounded-xl shadow-lg overflow-hidden mb-6 border border-cyan-500/20 hover:border-cyan-400/40 transition-all">
      <div
        className="p-4 cursor-pointer hover:bg-indigo-900/40 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
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
          <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
            {isAdmin && playlistMenuItems.length > 0 && (
              <CardMenu items={playlistMenuItems} />
            )}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1"
              aria-label={isExpanded ? 'Collapse playlist' : 'Expand playlist'}
            >
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
            </button>
          </div>
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
                  showMenu={isAdmin}
                  onEdit={setEditingVideo}
                  onDelete={handleDeleteVideo}
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

      {editingVideo && (
        <EditVideoModal
          video={editingVideo}
          onClose={() => setEditingVideo(null)}
          onSuccess={() => {
            setEditingVideo(null);
            onRefresh?.();
          }}
        />
      )}

      {editingPlaylist && (
        <EditPlaylistModal
          playlist={playlist}
          onClose={() => setEditingPlaylist(false)}
          onSuccess={() => {
            setEditingPlaylist(false);
            onRefresh?.();
          }}
        />
      )}
    </div>
  );
};

export default PlaylistDetail;
