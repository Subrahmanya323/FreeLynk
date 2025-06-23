import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Loading from '../components/Loading';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [project, setProject] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidForm, setBidForm] = useState({
    amount: '',
    proposal: '',
    estimatedDays: ''
  });
  const [showBidForm, setShowBidForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const [projectRes, bidsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/projects/${id}`),
        user?.role === 'Client' ? axios.get(`http://localhost:5000/api/bids/project/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }) : Promise.resolve({ data: { bids: [] } })
      ]);

      setProject(projectRes.data.project);
      setBids(bidsRes.data.bids || []);
    } catch (error) {
      console.error('Error fetching project details:', error);
      setError('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await axios.post('http://localhost:5000/api/bids', {
        projectId: id,
        ...bidForm
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowBidForm(false);
      setBidForm({ amount: '', proposal: '', estimatedDays: '' });
      fetchProjectDetails();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to place bid');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptBid = async (bidId) => {
    try {
      await axios.put(`http://localhost:5000/api/bids/${bidId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProjectDetails();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to accept bid');
    }
  };

  const handleRejectBid = async (bidId) => {
    try {
      await axios.put(`http://localhost:5000/api/bids/${bidId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProjectDetails();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reject bid');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Web Development': 'bg-blue-100 text-blue-800',
      'Mobile Development': 'bg-green-100 text-green-800',
      'Design': 'bg-purple-100 text-purple-800',
      'Writing': 'bg-yellow-100 text-yellow-800',
      'Marketing': 'bg-pink-100 text-pink-800',
      'Data Science': 'bg-indigo-100 text-indigo-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['Other'];
  };

  const getStatusColor = (status) => {
    const colors = {
      'Open': 'bg-green-100 text-green-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-purple-100 text-purple-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || colors['Open'];
  };

  if (loading) {
    return <Loading size="lg" text="Loading project details..." />;
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-4">The project you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/browse-projects')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Projects
          </button>
        </div>
      </div>
    );
  }

  const canBid = user?.role === 'Freelancer' && project.status === 'Open' && project.postedBy._id !== user?._id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Project Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(project.category)}`}>
                  {project.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
              <p className="text-gray-600 mb-4">Posted by {project.postedBy.name} on {formatDate(project.createdAt)}</p>
            </div>
            <div className="lg:ml-8 mt-4 lg:mt-0">
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  ${project.budget.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Budget</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Deadline</h3>
              <p className="text-gray-900">{formatDate(project.deadline)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Posted</h3>
              <p className="text-gray-900">{formatDate(project.createdAt)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Bids</h3>
              <p className="text-gray-900">{bids.length} bids received</p>
            </div>
          </div>

          {project.skills && project.skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Project Description</h3>
            <div className="prose max-w-none">
              <p className="text-gray-900 whitespace-pre-wrap">{project.description}</p>
            </div>
          </div>
        </div>

        {/* Bid Section */}
        {user?.role === 'Freelancer' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Place Your Bid</h2>
              {canBid && (
                <button
                  onClick={() => setShowBidForm(!showBidForm)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  {showBidForm ? 'Cancel' : 'Place Bid'}
                </button>
              )}
            </div>

            {!canBid && (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  {project.status !== 'Open' 
                    ? 'This project is no longer accepting bids.'
                    : project.postedBy._id === user?._id
                    ? 'You cannot bid on your own project.'
                    : 'You need to be a freelancer to place bids.'
                  }
                </p>
              </div>
            )}

            {showBidForm && canBid && (
              <form onSubmit={handleBidSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Bid Amount (USD) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">$</span>
                      <input
                        id="amount"
                        type="number"
                        required
                        min="1"
                        value={bidForm.amount}
                        onChange={(e) => setBidForm({ ...bidForm, amount: e.target.value })}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your bid amount"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="estimatedDays" className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Days *
                    </label>
                    <input
                      id="estimatedDays"
                      type="number"
                      required
                      min="1"
                      max="365"
                      value={bidForm.estimatedDays}
                      onChange={(e) => setBidForm({ ...bidForm, estimatedDays: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="How many days will it take?"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="proposal" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Proposal *
                  </label>
                  <textarea
                    id="proposal"
                    required
                    rows={6}
                    value={bidForm.proposal}
                    onChange={(e) => setBidForm({ ...bidForm, proposal: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Describe your approach, experience, and why you're the best fit for this project..."
                    maxLength={2000}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {bidForm.proposal.length}/2000 characters
                  </p>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowBidForm(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {submitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Placing Bid...
                      </div>
                    ) : (
                      'Place Bid'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Bids List (for project owner) */}
        {user?.role === 'Client' && project.postedBy._id === user?._id && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Bids Received ({bids.length})
            </h2>

            {bids.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No bids received yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bids.map((bid) => (
                  <div key={bid._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow duration-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{bid.freelancer.name}</h3>
                        <p className="text-gray-600">{bid.freelancer.email}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          ${bid.amount.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">{bid.estimatedDays} days</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Proposal</h4>
                      <p className="text-gray-900 whitespace-pre-wrap">{bid.proposal}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Bid placed on {formatDate(bid.createdAt)}
                      </div>
                      <div className="flex space-x-2">
                        {bid.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleAcceptBid(bid._id)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleRejectBid(bid._id)}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {bid.status === 'Accepted' && (
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            Accepted
                          </span>
                        )}
                        {bid.status === 'Rejected' && (
                          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                            Rejected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails; 