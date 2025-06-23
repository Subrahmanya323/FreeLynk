const express = require('express');
const router = express.Router();
const { 
  createProject, 
  getProjects, 
  getProjectById, 
  updateProject, 
  deleteProject, 
  getMyProjects 
} = require('../controllers/projectController');
const { auth, requireRole } = require('../middleware/auth');

// Public routes (for browsing projects)
router.get('/', getProjects);
router.get('/:id', getProjectById);

// Protected routes
router.use(auth); // All routes below require authentication

// Client-only routes
router.post('/', requireRole(['Client']), createProject);
router.get('/my/projects', requireRole(['Client']), getMyProjects);
router.put('/:id', requireRole(['Client']), updateProject);
router.delete('/:id', requireRole(['Client']), deleteProject);

module.exports = router; 