const express = require('express');
const router = express.Router();
const { 
  getFreelancerStats, 
  getClientStats, 
  searchFreelancers, 
  getFreelancerProfile, 
  updateProfile 
} = require('../controllers/userController');
const { auth, requireRole } = require('../middleware/auth');

// Public routes
router.get('/search/freelancers', searchFreelancers);
router.get('/freelancer/:id', getFreelancerProfile);

// Protected routes
router.use(auth);

// Dashboard statistics
router.get('/stats/freelancer', requireRole(['Freelancer']), getFreelancerStats);
router.get('/stats/client', requireRole(['Client']), getClientStats);

// Profile management
router.put('/profile', updateProfile);

module.exports = router; 