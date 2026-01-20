const VideoPlayer = ({ youtubeId, title, onClose }) => {
  if (!youtubeId) return null;

  // Build YouTube embed URL with proper parameters
  // Removed 'origin' parameter to avoid YouTube Error 153
  const getEmbedUrl = () => {
    const baseUrl = `https://www.youtube.com/embed/${youtubeId}`;
    const params = new URLSearchParams({
      autoplay: '1',
      rel: '0',
      modestbranding: '1',
    });
    
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900 line-clamp-1">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 transition-colors"
            aria-label="Close video"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="relative pb-[56.25%] bg-black">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={getEmbedUrl()}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
