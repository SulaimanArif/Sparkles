import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (window.innerWidth < 1024) {
      onToggle();
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      <aside className={`bg-space-dark border-r border-indigo-900/50 text-white h-screen fixed left-0 top-0 z-50 transition-all duration-300 flex flex-col backdrop-blur-sm ${
        isOpen ? 'w-64' : 'w-16'
      } ${!isOpen ? '-translate-x-full lg:translate-x-0' : ''} lg:block`}>
      {/* Logo */}
      <div className="p-4 border-b border-indigo-900/50 flex items-center justify-between bg-gradient-to-r from-indigo-900/20 to-purple-900/20">
        {isOpen && (
          <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            ✨ Sparkles
          </h1>
        )}
        <button
          onClick={onToggle}
          className="p-2 hover:bg-indigo-900/30 rounded-lg transition-colors lg:block hidden text-cyan-300"
          aria-label="Toggle sidebar"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex-1 overflow-y-auto">
        <Link
          to="/"
          onClick={handleLinkClick}
          className={`flex items-center px-4 py-3 transition-all ${
            isActive('/')
              ? 'bg-gradient-to-r from-indigo-600/50 to-purple-600/50 text-white border-l-4 border-cyan-400 shadow-lg shadow-cyan-500/20'
              : 'hover:bg-indigo-900/20 text-cyan-100 border-l-4 border-transparent'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          {isOpen && <span>Home</span>}
        </Link>

        <Link
          to="/videos"
          onClick={handleLinkClick}
          className={`flex items-center px-4 py-3 transition-all ${
            isActive('/videos')
              ? 'bg-gradient-to-r from-indigo-600/50 to-purple-600/50 text-white border-l-4 border-cyan-400 shadow-lg shadow-cyan-500/20'
              : 'hover:bg-indigo-900/20 text-cyan-100 border-l-4 border-transparent'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {isOpen && <span>Videos</span>}
        </Link>
      </nav>

      {/* User Info and Logout */}
      <div className="p-4 border-t border-indigo-900/50 mt-auto bg-indigo-900/10">
        {isOpen && user && (
          <div className="mb-3 px-4 py-2 text-sm text-cyan-200 bg-indigo-900/20 rounded-lg border border-cyan-500/20">
            <span className="text-cyan-300 font-semibold">{user.username}</span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-cyan-200 hover:bg-indigo-900/30 transition-all rounded-lg border border-cyan-500/20 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/20"
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {isOpen && <span>Logout</span>}
        </button>
      </div>
      </aside>
    </>
  );
};

export default Sidebar;
