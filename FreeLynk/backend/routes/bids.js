const express = require('express');
const router = express.Router();
const { 
  createBid, 
  getProjectBids, 
  getMyBids, 
  acceptBid, 
  rejectBid, 
  updateBid, 
  deleteBid, 
  getBidStats 
} = require('../controllers/bidController');
const { auth, requireRole } = require('../middleware/auth');

// All bid routes require authentication
router.use(auth);

// Freelancer routes
router.post('/', requireRole(['Freelancer']), createBid);
router.get('/my-bids', requireRole(['Freelancer']), getMyBids);
router.get('/stats', requireRole(['Freelancer']), getBidStats);
router.put('/:bidId', requireRole(['Freelancer']), updateBid);
router.delete('/:bidId', requireRole(['Freelancer']), deleteBid);

// Client routes
router.get('/project/:projectId', requireRole(['Client']), getProjectBids);
router.put('/:bidId/accept', requireRole(['Client']), acceptBid);
router.put('/:bidId/reject', requireRole(['Client']), rejectBid);

module.exports = router; 