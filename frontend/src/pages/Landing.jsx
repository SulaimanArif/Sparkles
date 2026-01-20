import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-space-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Starfield background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl w-full text-center relative z-10">
        <div className="mb-8">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]">
            ✨ Sparkles Video Platform
          </h1>
        </div>

        <div className="bg-indigo-900/30 backdrop-blur-md rounded-2xl shadow-2xl p-8 mb-8 border border-cyan-500/20 hover:border-cyan-400/40 transition-all">
          <h2 className="text-2xl font-semibold text-cyan-200 mb-4">
            Welcome to Sparkles
          </h2>
          <p className="text-purple-200 mb-6">
            Please sign in to access your video playlists and start organizing your favorite content.
          </p>
          <Link
            to="/signin"
            className="inline-block bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-cyan-400 hover:to-purple-500 transition-all shadow-lg shadow-purple-500/50 hover:shadow-purple-400/70 hover:scale-105"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
