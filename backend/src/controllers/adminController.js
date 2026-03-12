const { User, ActivityLog } = require('../models');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByPk(req.params.id);

        if (user) {
            user.role = role || user.role;
            await user.save();
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (user) {
            user.status = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
            await user.save();
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (user) {
            if (user.role === 'ADMIN') {
                return res.status(403).json({ message: 'Cannot delete an Admin account' });
            }
            await user.destroy();
            res.json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getStudentActivity = async (req, res) => {
    try {
        const activity = await ActivityLog.findAll({
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email', 'role']
            }],
            order: [['loginTime', 'DESC']],
            limit: 100 // return latest 100 activities
        });

        // Transform for MongoDB compat if needed by frontend
        const result = activity.map(log => {
            const plain = log.toJSON();
            if (plain.user) {
                plain.user = { ...plain.user, _id: String(plain.user.id) };
            }
            return plain;
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyUserManually = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (user) {
            user.isVerified = true;
            user.verificationCode = null;
            await user.save();
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                isVerified: user.isVerified
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllUsers, updateUserRole, toggleUserStatus, deleteUser, getStudentActivity, verifyUserManually };
