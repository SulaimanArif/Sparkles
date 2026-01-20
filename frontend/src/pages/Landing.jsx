import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-white mb-4">
            ✨ Sparkles Video Platform
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Welcome to Sparkles
          </h2>
          <p className="text-gray-600 mb-6">
            Please sign in to access your video playlists and start organizing your favorite content.
          </p>
          <Link
            to="/signin"
            className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
