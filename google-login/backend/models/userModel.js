const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const UserModel = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    image: {
        type: DataTypes.TEXT,
    },
}, {
    tableName: 'users',
    timestamps: false,
})

module.exports = UserModel;
