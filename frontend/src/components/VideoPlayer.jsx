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
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Invalid Video ID</h2>
          <p className="text-gray-600 mb-4">The YouTube video ID is invalid.</p>
          <button
            onClick={onClose}
            className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
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
          {hasError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white">
              <p className="text-lg mb-4">Unable to load video</p>
              <a
                href={`https://www.youtube.com/watch?v=${youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
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
