const User = require('../models/User');
const Project = require('../models/Project');
const Bid = require('../models/Bid');

// Get freelancer statistics for dashboard
const getFreelancerStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get bid statistics
    const bidStats = await Bid.aggregate([
      { $match: { freelancer: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    // Get project statistics
    const projectStats = await Project.aggregate([
      { $match: { acceptedBid: { $exists: true } } },
      {
        $lookup: {
          from: 'bids',
          localField: 'acceptedBid',
          foreignField: '_id',
          as: 'acceptedBidData'
        }
      },
      { $unwind: '$acceptedBidData' },
      { $match: { 'acceptedBidData.freelancer': userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Format statistics
    const stats = {
      totalBids: 0,
      pendingBids: 0,
      acceptedBids: 0,
      rejectedBids: 0,
      totalEarnings: 0,
      activeProjects: 0,
      completedProjects: 0
    };

    bidStats.forEach(stat => {
      stats.totalBids += stat.count;
      stats[`${stat._id.toLowerCase()}Bids`] = stat.count;
      if (stat._id === 'Accepted') {
        stats.totalEarnings = stat.totalAmount;
      }
    });

    projectStats.forEach(stat => {
      if (stat._id === 'In Progress') {
        stats.activeProjects = stat.count;
      } else if (stat._id === 'Completed') {
        stats.completedProjects = stat.count;
      }
    });

    res.json({ stats });
  } catch (error) {
    console.error('Get freelancer stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get client statistics for dashboard
const getClientStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get project statistics
    const projectStatsPromise = Project.aggregate([
      { $match: { postedBy: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get total project count separately for accuracy
    const totalProjectsPromise = Project.countDocuments({ postedBy: userId });

    // Get bid statistics
    const bidStatsPromise = Bid.aggregate([
      {
        $lookup: {
          from: 'projects',
          localField: 'project',
          foreignField: '_id',
          as: 'projectData'
        }
      },
      { $unwind: '$projectData' },
      { $match: { 'projectData.postedBy': userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const [projectStats, totalProjects, bidStats] = await Promise.all([
      projectStatsPromise,
      totalProjectsPromise,
      bidStatsPromise
    ]);

    // Format statistics
    const stats = {
      totalProjects: totalProjects,
      openProjects: 0,
      inProgressProjects: 0,
      completedProjects: 0,
      totalBids: 0,
      pendingBids: 0,
      acceptedBids: 0
    };

    projectStats.forEach(stat => {
      if (stat._id === 'Open') {
        stats.openProjects = stat.count;
      } else if (stat._id === 'In Progress') {
        stats.inProgressProjects = stat.count;
      } else if (stat._id === 'Completed') {
        stats.completedProjects = stat.count;
      }
    });

    bidStats.forEach(stat => {
      stats.totalBids += stat.count;
      if (stat._id === 'Pending') {
        stats.pendingBids = stat.count;
      } else if (stat._id === 'Accepted') {
        stats.acceptedBids = stat.count;
      }
    });

    res.json({ stats });
  } catch (error) {
    console.error('Get client stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search freelancers
const searchFreelancers = async (req, res) => {
  try {
    const { 
      search, 
      skills, 
      minRate, 
      maxRate, 
      minRating,
      page = 1,
      limit = 10
    } = req.query;

    const filter = { role: 'Freelancer' };

    // Search by name or bio
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by skills
    if (skills) {
      const skillArray = skills.split(',').map(skill => skill.trim());
      filter.skills = { $in: skillArray };
    }

    // Filter by hourly rate
    if (minRate || maxRate) {
      filter.hourlyRate = {};
      if (minRate) filter.hourlyRate.$gte = Number(minRate);
      if (maxRate) filter.hourlyRate.$lte = Number(maxRate);
    }

    // Filter by rating
    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }

    const skip = (page - 1) * limit;

    const freelancers = await User.find(filter)
      .select('-password')
      .sort({ rating: -1, completedProjects: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(filter);

    res.json({
      freelancers,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Search freelancers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get freelancer profile
const getFreelancerProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const freelancer = await User.findById(id)
      .select('-password')
      .lean();

    if (!freelancer || freelancer.role !== 'Freelancer') {
      return res.status(404).json({ message: 'Freelancer not found' });
    }

    // Get freelancer's completed projects
    const completedProjects = await Project.aggregate([
      { $match: { status: 'Completed' } },
      {
        $lookup: {
          from: 'bids',
          localField: 'acceptedBid',
          foreignField: '_id',
          as: 'acceptedBidData'
        }
      },
      { $unwind: '$acceptedBidData' },
      { $match: { 'acceptedBidData.freelancer': freelancer._id } },
      {
        $project: {
          title: 1,
          description: 1,
          budget: 1,
          category: 1,
          completedAt: '$updatedAt'
        }
      },
      { $sort: { completedAt: -1 } },
      { $limit: 5 }
    ]);

    // Get freelancer's recent bids
    const recentBids = await Bid.find({ freelancer: freelancer._id })
      .populate('project', 'title budget category status')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json({
      freelancer,
      completedProjects,
      recentBids
    });
  } catch (error) {
    console.error('Get freelancer profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { bio, skills, hourlyRate, location, website, socialLinks } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { bio, skills, hourlyRate, location, website, socialLinks },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getFreelancerStats,
  getClientStats,
  searchFreelancers,
  getFreelancerProfile,
  updateProfile
}; 