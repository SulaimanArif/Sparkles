import { useState, useEffect } from 'react';

const VideoPlayer = ({ youtubeId, title, onClose }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset error state when video changes
    setHasError(false);
  }, [youtubeId]);

  if (!youtubeId) return null;

  // Validate YouTube ID format (should be 11 characters)
  if (youtubeId.length !== 11) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
        <div className="bg-indigo-900/40 backdrop-blur-md rounded-xl max-w-md w-full p-6 border border-cyan-500/30 shadow-2xl">
          <h2 className="text-xl font-semibold text-cyan-200 mb-4">Invalid Video ID</h2>
          <p className="text-purple-200 mb-4">The YouTube video ID is invalid.</p>
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-cyan-400 hover:to-purple-500 transition-all shadow-lg shadow-purple-500/50"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Use YouTube privacy-enhanced embed (youtube-nocookie.com)
  // This reduces cookie-related issues and Error 153
  const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`;

  const handleIframeError = () => {
    setHasError(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="bg-indigo-900/40 backdrop-blur-md rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-cyan-500/30 shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b border-cyan-500/20 bg-indigo-900/50">
          <h2 className="text-xl font-semibold text-cyan-200 line-clamp-1">
            {title || 'Video Player'}
          </h2>
          <button
            onClick={onClose}
            className="text-cyan-300 hover:text-cyan-100 p-2 transition-colors hover:bg-indigo-900/50 rounded-lg"
            aria-label="Close video"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="relative pb-[56.25%] bg-black">
          {hasError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white bg-indigo-900/30">
              <p className="text-lg mb-4 text-cyan-200">Unable to load video</p>
              <a
                href={`https://www.youtube.com/watch?v=${youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-6 py-2 rounded-lg transition-all shadow-lg"
              >
                Watch on YouTube
              </a>
            </div>
          ) : (
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={embedUrl}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              credentialless="false"
              referrerPolicy="no-referrer-when-downgrade"
              onError={handleIframeError}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
