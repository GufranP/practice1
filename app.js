const express = require('express');
const bodyParser = require('body-parser');
const { engine } = require('express-handlebars');
const path = require('path');

// Database
const db = require('./config/database');
const Employee = require('./Models/Employee');  // Import the Employee model to trigger the sync

// Test the database connection
db.authenticate()
  .then(() => {
    console.log('Database connected!');
    // Sync the models with the database
    return db.sync();  // This will create tables (drop existing ones)
  })
  .then(() => {
    console.log('Tables created!');
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

const app = express();

// Handlebars
app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Body parse
app.use(bodyParser.urlencoded({ extended: false }));

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));


// Index Route
app.get('/', (req, res) => res.render('index', { layout: 'landing'}));

// Employee routes

app.use('/employees', require('./routes/employees'));

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
