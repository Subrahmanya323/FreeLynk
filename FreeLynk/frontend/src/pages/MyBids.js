import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Loading from '../components/Loading';

const MyBids = () => {
  const { token } = useAuth();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyBids();
  }, []);

  const fetchMyBids = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/bids/my-bids', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBids(response.data.bids);
    } catch (error) {
      console.error('Error fetching bids:', error);
      setError('Failed to load your bids');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBid = async (bidId) => {
    if (!window.confirm('Are you sure you want to delete this bid?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/bids/${bidId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMyBids();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete bid');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Accepted': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return colors[status] || colors['Pending'];
  };

  if (loading) {
    return <Loading size="lg" text="Loading your bids..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bids</h1>
          <p className="text-gray-600">Track all your project bids and their status</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {bids.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bids yet</h3>
            <p className="text-gray-600 mb-4">Start bidding on projects to see them here</p>
            <Link
              to="/browse-projects"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Browse Projects
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bids.map((bid) => (
              <div key={bid._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <Link
                        to={`/projects/${bid.project._id}`}
                        className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {bid.project.title}
                      </Link>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bid.status)}`}>
                        {bid.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Your Bid:</span>
                        <p className="text-lg font-bold text-green-600">${bid.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Project Budget:</span>
                        <p className="text-gray-900">${bid.project.budget.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Estimated Days:</span>
                        <p className="text-gray-900">{bid.estimatedDays} days</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Your Proposal</h4>
                      <p className="text-gray-900 text-sm line-clamp-3">{bid.proposal}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Bid placed on {formatDate(bid.createdAt)}</span>
                      <span className="capitalize">{bid.project.category}</span>
                    </div>
                  </div>

                  <div className="lg:ml-6 mt-4 lg:mt-0 flex flex-col space-y-2">
                    <Link
                      to={`/projects/${bid.project._id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center"
                    >
                      View Project
                    </Link>
                    {bid.status === 'Pending' && (
                      <button
                        onClick={() => handleDeleteBid(bid._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        Delete Bid
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBids; 