const Bid = require('../models/Bid');
const Project = require('../models/Project');
const User = require('../models/User');

// Create a new bid
const createBid = async (req, res) => {
  try {
    const { projectId, amount, proposal, estimatedDays } = req.body;
    
    // Check if project exists and is open
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.status !== 'Open') {
      return res.status(400).json({ message: 'Project is not accepting bids' });
    }
    
    // Check if user already bid on this project
    const existingBid = await Bid.findOne({
      project: projectId,
      freelancer: req.user._id
    });
    
    if (existingBid) {
      return res.status(400).json({ message: 'You have already placed a bid on this project' });
    }
    
    // Check if user is trying to bid on their own project
    if (project.postedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot bid on your own project' });
    }
    
    const bid = new Bid({
      project: projectId,
      freelancer: req.user._id,
      amount,
      proposal,
      estimatedDays
    });

    await bid.save();

    // Populate the freelancer field with user info
    await bid.populate('freelancer', 'name email');
    await bid.populate('project', 'title budget');

    res.status(201).json({
      message: 'Bid placed successfully',
      bid
    });
  } catch (error) {
    console.error('Create bid error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get bids for a specific project
const getProjectBids = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Only project owner can see all bids
    if (project.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view bids' });
    }
    
    const bids = await Bid.find({ project: projectId })
      .populate('freelancer', 'name email')
      .sort({ amount: 1, createdAt: -1 });

    res.json({ bids });
  } catch (error) {
    console.error('Get project bids error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get bids by freelancer (my bids)
const getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ freelancer: req.user._id })
      .populate('project', 'title budget status category')
      .sort({ createdAt: -1 });

    res.json({ bids });
  } catch (error) {
    console.error('Get my bids error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Accept a bid
const acceptBid = async (req, res) => {
  try {
    const { bidId } = req.params;
    
    const bid = await Bid.findById(bidId).populate('project');
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }
    
    // Check if user owns the project
    if (bid.project.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to accept this bid' });
    }
    
    // Check if project is still open
    if (bid.project.status !== 'Open') {
      return res.status(400).json({ message: 'Project is no longer accepting bids' });
    }
    
    // Update bid status
    bid.status = 'Accepted';
    await bid.save();
    
    // Update project status and accepted bid
    await Project.findByIdAndUpdate(bid.project._id, {
      status: 'In Progress',
      acceptedBid: bidId
    });
    
    // Reject all other bids for this project
    await Bid.updateMany(
      { 
        project: bid.project._id, 
        _id: { $ne: bidId },
        status: 'Pending'
      },
      { status: 'Rejected' }
    );
    
    // Populate for response
    await bid.populate('freelancer', 'name email');
    await bid.populate('project', 'title budget');

    res.json({
      message: 'Bid accepted successfully',
      bid
    });
  } catch (error) {
    console.error('Accept bid error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reject a bid
const rejectBid = async (req, res) => {
  try {
    const { bidId } = req.params;
    
    const bid = await Bid.findById(bidId).populate('project');
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }
    
    // Check if user owns the project
    if (bid.project.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to reject this bid' });
    }
    
    bid.status = 'Rejected';
    await bid.save();
    
    await bid.populate('freelancer', 'name email');
    await bid.populate('project', 'title budget');

    res.json({
      message: 'Bid rejected successfully',
      bid
    });
  } catch (error) {
    console.error('Reject bid error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update bid
const updateBid = async (req, res) => {
  try {
    const { bidId } = req.params;
    const { amount, proposal, estimatedDays } = req.body;
    
    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }
    
    // Check if user owns the bid
    if (bid.freelancer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this bid' });
    }
    
    // Check if bid can still be updated
    if (bid.status !== 'Pending') {
      return res.status(400).json({ message: 'Bid cannot be updated' });
    }
    
    const updatedBid = await Bid.findByIdAndUpdate(
      bidId,
      { amount, proposal, estimatedDays },
      { new: true }
    ).populate('freelancer', 'name email')
     .populate('project', 'title budget status');

    res.json({
      message: 'Bid updated successfully',
      bid: updatedBid
    });
  } catch (error) {
    console.error('Update bid error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete bid
const deleteBid = async (req, res) => {
  try {
    const { bidId } = req.params;
    
    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }
    
    // Check if user owns the bid
    if (bid.freelancer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this bid' });
    }
    
    // Check if bid can be deleted
    if (bid.status !== 'Pending') {
      return res.status(400).json({ message: 'Bid cannot be deleted' });
    }
    
    await Bid.findByIdAndDelete(bidId);

    res.json({ message: 'Bid deleted successfully' });
  } catch (error) {
    console.error('Delete bid error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get bid statistics
const getBidStats = async (req, res) => {
  try {
    const stats = await Bid.aggregate([
      { $match: { freelancer: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    const formattedStats = {
      total: 0,
      pending: 0,
      accepted: 0,
      rejected: 0,
      totalAmount: 0
    };

    stats.forEach(stat => {
      formattedStats[stat._id.toLowerCase()] = stat.count;
      formattedStats.total += stat.count;
      if (stat._id === 'Accepted') {
        formattedStats.totalAmount = stat.totalAmount;
      }
    });

    res.json({ stats: formattedStats });
  } catch (error) {
    console.error('Get bid stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createBid,
  getProjectBids,
  getMyBids,
  acceptBid,
  rejectBid,
  updateBid,
  deleteBid,
  getBidStats
}; 