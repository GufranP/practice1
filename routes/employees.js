const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Employee = require('../Models/Employee');
const sequelize = require('sequelize');
const Op = sequelize.Op;

//Get Employee list

router.get('/', (req, res) => 
    Employee.findAll({raw: true, order: [
        ['id', 'ASC'],
    ],})
        .then(employees => {
            res.render('employees', {
                employees
            });
        })
        .catch(err => console.log('Error:' +err)));

//Display Add Employee form

router.get('/add', (req, res) => {
    res.render('add')
});
//add a Employee

router.post('/add', (req, res) => {
   
    let {name, department, age, contact_email } = req.body;
    let errors = [];

//Validate Fields

    if(!name) {
        errors.push({ text: 'Please add a title'});
    }
    if(!department) {
        errors.push({ text: 'Please add a description'});
    }
    if(!age) {
        errors.push({ text: 'Please add a age'});
    }
    if(!contact_email) {
        errors.push({ text: 'Please add a Contact Email'});
    }

    if (errors.length > 0){
        res.render('add', {
            errors,
            name,
            department,
            age,
            contact_email
        });
    }else {
        
    // Make lowercase and insert into lowercase
        department = department.toLowerCase().replace(/,/g,',');

        // Insert Into Table
        Employee.create({
            name,
            department,
            age,
            contact_email
        })
        .then(employee => res.redirect('/employees'))
        .catch(err => console.log(err));
    }

// Insert Into Table

    // Employee.create({
    //     title,
    //     technologies,
    //     budget,
    //     description,
    //     contact_email
    // })
    // .then(employee => res.redirect('/employees'))
    // .catch(err => console.log(err));
});

// Search for employees

// Update employee form

router.get('/:id/update', async (req, res) => {
    const employee = await Employee.findByPk(req.params.id);
    if (employee === null) {
    console.log('Not found!');
    } else {
        console.log(employee); // true
        res.render('update',{
            id:req.params.id,
            name:employee.name,
            department:employee.department,
            age:employee.age,
            contact_email:employee.contact_email
        })
    }
    
});

router.post('/:id/update', async (req, res) => {
    const employee = await Employee.findByPk(req.params.id);
    const { name, department, age, contact_email } = req.body;
    if (employee == null) {
        console.log('Not Found!');
    } else {
        employee.name = name;
        employee.department = department;
        employee.age = age;
        employee.contact_email = contact_email;

        await employee.save();

        res.redirect('/employees');
    }

});

// Delete an employee

router.post('/:id/delete', async (req, res) => {
    try {
      const employee = await Employee.findByPk(req.params.id);
  
      if (!employee) {
        console.log('Employee not found!');
        return res.status(404).send('Employee not found');
      }
  
      // Delete the employee
      await employee.destroy();
  
      // Redirect to the list of employees after successful deletion
      res.redirect('/employees'); 
    } catch (error) {
      console.log('Error deleting employee:', error);
      res.status(500).send('Server error');
    }
  });

router.get('/search', (req, res) => {
    let {term} = req.query;
    
    term = term.toLowerCase;
    Employee.findAll({raw: true, where:{department: { [Op.like]: '%' + term + '%' }}} )
    .then(employees => res.render('employees', {employees}))
    .catch(err => console.log(err));
});

module.exports = router;
