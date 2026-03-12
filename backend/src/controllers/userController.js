const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (id, role, status) => {
    return jwt.sign({ id, role, status }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = req.body.name || user.name;

        if (req.body.password) {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(req.body.password)) {
                return res.status(400).json({ message: 'Password must be at least 8 characters and contain uppercase, lowercase, numbers, and a special character.' });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        await user.save();

        res.json({
            _id: String(user.id),
            userId: user.userId,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            token: generateToken(user.id, user.role, user.status),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user profile
// @route   DELETE /api/users/profile
// @access  Private
const deleteUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { updateUserProfile, deleteUserProfile };
