const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');

// Protected routes
router.use(authenticate);

// These routes will be implemented as needed for user management features
// Example endpoints for future implementation:
// - GET /api/users
// - GET /api/users/:id
// - PUT /api/users/:id
// - DELETE /api/users/:id
// - GET /api/users/vendors
// - etc.

module.exports = router;
