
// index.js
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const User = require('./models/user');
const Client = require('./models/client');
const Car = require('./models/car');

const app = express();
const PORT = 8000; // Use environment variable or default to 8000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// Test route to see on Kubernetes 8
app.get('/', (req, res, next) => {
  res.send('Hello oops hadia i mean');
});

// CRUD routes
app.use('/users', require('./routes/users'));
app.use('/cars', require('./routes/cars'));
app.use('/clients', require('./routes/clients'));
app.use('/agencies', require('./routes/agencies'));

// Sync database
const syncDatabase = async () => {
  try {
    await sequelize.sync(); // Await Sequelize sync
    if (process.env.NODE_ENV !== 'test') { // Only listen when not in test environment
      console.log("Database connected");
      app.server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};

// Call the function to sync the database
syncDatabase();


app.use((error, req, res, next) => {
  console.error(error);
  const status = error.statusCode || error.status || 500;
  const message = error.message || 'Internal Server Error';
  res.status(status).json({ message: message });
});


module.exports = app; // Export app for testing

/*
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');

// Import route handlers
const usersRoutes = require('./routes/users');
const carsRoutes = require('./routes/cars');
const clientsRoutes = require('./routes/clients');
const agenciesRoutes = require('./routes/agencies');

// Function to initialize Express app
function initApp(sequelizeInstance) {
  const app = express();

  // Middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  // CORS
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
  });

  // Test route
  app.get('/', (req, res, next) => {
    res.send('Hello World');
  });

  // CRUD routes
  app.use('/users', usersRoutes);
  app.use('/cars', carsRoutes);
  app.use('/clients', clientsRoutes);
  app.use('/agencies', agenciesRoutes);

  // Error handling middleware
  app.use((error, req, res, next) => {
    console.error(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
  });

  return app;
}

// Initialize Express app
const app = initApp(sequelize);

// Sync database
sequelize
  .sync()
  .then(() => {
    console.log("Database connected");
  })
  .catch(err => console.error(err));

module.exports = { app, sequelize };
*/
/*const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const User = require('./models/user');
const Client = require('./models/client');
const Car = require('./models/car');

const app = express();
const PORT = process.env.PORT || 8000; // Use environment variable or default to 8000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// Test route to see on Kubernetes 8
app.get('/', (req, res, next) => {
  res.send('Hello oops hadia i mean');
});

// CRUD routes
app.use('/users', require('./routes/users'));
app.use('/cars', require('./routes/cars'));
app.use('/clients', require('./routes/clients'));
app.use('/agencies', require('./routes/agencies'));

// Sync database
const syncDatabase = async () => {
  try {
    await sequelize.sync(); // Await Sequelize sync
    if (process.env.NODE_ENV !== 'test') { // Only listen when not in test environment
      console.log("Database connected");
      app.server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};

// Call the function to sync the database
syncDatabase();

// Error handling (move to the end)
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

module.exports = app; // Export app for testing
*/
/*

const express = require('express');
const bodyparser = require('body-parser');
const sequelize = require('./util/database');
const User = require('./models/user');
const Client = require('./models/client');
const Car = require('./models/car');

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

//test route
app.get('/', (req, res, next) => {
  res.send('Hello World from hadia app' );
});

//CRUD routes
app.use('/users', require('./routes/users'));
app.use('/cars', require('./routes/cars'));
app.use('/clients', require('./routes/clients'));
app.use('/agencies', require('./routes/agencies'));

//error handling
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

//sync database
sequelize
  .sync()
  .then(result => {
    console.log("Database connected");
    app.listen(8000);
  })
  .catch(err => console.log(err));*/