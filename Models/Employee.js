const { Sequelize } = require('sequelize'); // Not needed, since you're importing `db` directly

// Instead of this
// const sequelize = require('sequelize');

const db = require('../config/database'); // Use `db` from your database config

const Employee = db.define('employee', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING
    },
    department: {
        type: Sequelize.STRING
    },
    age: {
        type: Sequelize.INTEGER
    },
    contact_email: {
      type:Sequelize.STRING
  }
});

db.sync()  // This should create or drop and recreate the table
  .then(() => {
    console.log('Database and tables created!');
  })
  .catch(error => {
    console.error('Error syncing database:', error);
  });

module.exports = Employee;
