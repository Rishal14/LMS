const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole, toggleUserStatus, deleteUser, getStudentActivity, verifyUserManually } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All routes here are protected and require ADMIN role
router.use(protect);
router.use(authorize('ADMIN'));

router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/status', toggleUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/activity', getStudentActivity);
router.put('/users/:id/verify', verifyUserManually);

module.exports = router;
