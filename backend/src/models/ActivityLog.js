const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ActivityLog = sequelize.define('ActivityLog', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    },
    loginTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    logoutTime: {
        type: DataTypes.DATE,
        allowNull: true
    },
    durationSeconds: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'activity_logs',
    timestamps: false
});

module.exports = ActivityLog;
