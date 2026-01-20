const VideoCard = ({ video, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
    >
      <div className="relative pb-[56.25%] bg-gray-200">
        <img
          src={video.thumbnail_url}
          alt={video.title}
          className="absolute top-0 left-0 w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/640x360?text=No+Thumbnail';
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity">
          <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
          {video.title || 'Untitled Video'}
        </h3>
        <p className="text-sm text-gray-500">{video.playlist_name}</p>
      </div>
    </div>
  );
};

export default VideoCard;
