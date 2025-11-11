import { DataTypes } from 'sequelize';
import sequelize from '../db/index.js';

const Task = sequelize.define('Task', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING(120), allowNull: false },
  description: { type: DataTypes.STRING(1000) },
  status: { type: DataTypes.ENUM('todo','in-progress','done'), defaultValue: 'todo' },
  dueDate: { type: DataTypes.DATE },
}, { tableName: 'tasks', timestamps: true, indexes: [{ fields: ['userId'] }] });

export default Task;
