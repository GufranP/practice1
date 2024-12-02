const Sequelize = require('sequelize');

module.exports = new Sequelize('employee', 'postgres', '060400', {
    host: 'localhost',
    dialect: 'postgres'
});