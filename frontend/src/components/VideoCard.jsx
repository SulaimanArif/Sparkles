import CardMenu from './CardMenu';

const VideoCard = ({ video, onClick, showMenu, onEdit, onDelete }) => {
  const menuItems = showMenu
    ? [
        { label: 'Edit', onClick: () => onEdit?.(video) },
        {
          label: 'Delete',
          danger: true,
          onClick: () => {
            if (window.confirm(`Delete "${video.title || 'this video'}"?`)) {
              onDelete?.(video);
            }
          },
        },
      ]
    : [];

  return (
    <div
      onClick={onClick}
      className="bg-indigo-900/30 backdrop-blur-sm rounded-xl shadow-lg cursor-pointer transition-all duration-200 hover:shadow-cyan-500/30 border border-cyan-500/20 hover:border-cyan-400/50"
    >
      <div className="relative pb-[56.25%] bg-indigo-900/50 overflow-hidden rounded-t-xl">
        <img
          src={video.thumbnail_url}
          alt={video.title}
          className="absolute top-0 left-0 w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/640x360?text=No+Thumbnail';
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-cyan-500/80 rounded-full p-4 backdrop-blur-sm">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="p-4 flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0" onClick={onClick}>
          <h3 className="font-semibold text-cyan-100 mb-1 line-clamp-2">
            {video.title || 'Untitled Video'}
          </h3>
          <p className="text-sm text-purple-300">{video.playlist_name}</p>
        </div>
        {showMenu && menuItems.length > 0 && (
          <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
            <CardMenu items={menuItems} />
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
