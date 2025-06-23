import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img src="/FreeLynk_Logo.jpeg" alt="FreeLynk" className="h-10 w-10 rounded-lg" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">FreeLynk</h1>
              <p className="text-xs text-gray-500">Connect • Create • Succeed</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Dashboard
            </Link>
            {user?.role === 'Client' && (
              <Link to="/create-project" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Create Project
              </Link>
            )}
            {user?.role === 'Freelancer' && (
              <Link to="/browse-projects" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Browse Projects
              </Link>
            )}
            {user?.role === 'Freelancer' && (
              <Link to="/my-bids" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                My Bids
              </Link>
            )}
            {user?.role ==='client' && (
            <Link to="/search-freelancers" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Find Freelancers
            </Link>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="hidden md:block bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
                Dashboard
              </Link>
              {user?.role === 'Client' && (
                <Link to="/create-project" className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
                  Create Project
                </Link>
              )}
              {user?.role === 'Freelancer' && (
                <Link to="/browse-projects" className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
                  Browse Projects
                </Link>
              )}
              {user?.role === 'Freelancer' && (
                <Link to="/my-bids" className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
                  My Bids
                </Link>
              )}
              <Link to="/browse-projects" className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
                All Projects
              </Link>
              <Link to="/search-freelancers" className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
                Find Freelancers
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 