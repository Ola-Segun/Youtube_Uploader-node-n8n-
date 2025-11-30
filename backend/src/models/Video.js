const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Video = sequelize.define('Video', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  youtubeId: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('pending', 'uploading', 'completed', 'failed'), defaultValue: 'pending' },
  progress: { type: DataTypes.INTEGER, defaultValue: 0 },
  fileUrl: { type: DataTypes.STRING, allowNull: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = Video;