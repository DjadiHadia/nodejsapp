const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// CRUD Controllers

//get all users
exports.getUsers = (req, res, next) => {
    User.findAll()
        .then(users => {
            res.status(200).json({ users: users });
        })
        .catch(err => console.log(err));
}

//get user by id
exports.getUser = (req, res, next) => {
    const userId = req.params.userId;
    User.findByPk(userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found!' });
            }
            res.status(200).json({ user: user });
        })
        .catch(err => console.log(err));
}



//update user
exports.updateUser = (req, res, next) => {
  const userId = req.params.userId;
  const updatedName = req.body.name;
  const updatedEmail = req.body.email;
  User.findByPk(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found!' });
      }
      user.name = updatedName;
      user.email = updatedEmail;
      return user.save();
    })
    .then(result => {
      res.status(200).json({message: 'User updated!', user: result});
    })
    .catch(err => console.log(err));
}

//delete user
exports.deleteUser = (req, res, next) => {
  const userId = req.params.userId;
  User.findByPk(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found!' });
      }
      return User.destroy({
        where: {
          id: userId
        }
      });
    })
    .then(result => {
      res.status(200).json({ message: 'User deleted!' });
    })
    .catch(err => console.log(err));
}

// Function to generate JWT token
function generateToken(user) {
  return jwt.sign({ userId: user.id }, 'mysecretkey', { expiresIn: '1h' }); // Replace with your own secret key
}

// Middleware to authenticate requests
exports.authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
      return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, 'mysecretkey', (err, decodedToken) => { // Replace with your own secret key
      if (err) {
          return res.status(401).json({ message: 'Invalid token' });
      }
      req.userId = decodedToken.userId;
      next();
  });
};

// Controller to register a new user
exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  console.log('Password received:', password); // Add this line

  // Hash password
  bcrypt.hash(password, 10)
      .then(hashedPassword => {
          console.log('Hashed password:', hashedPassword); // Add this line
          // Create user
          return User.create({ name, email, password: hashedPassword });
      })
      .then(user => {
          // Generate JWT token
          const token = generateToken(user);
          res.status(201).json({ message: 'User created successfully', token });
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({ message: 'Internal server error' });
      });
};


// Controller to login user
exports.loginUser = (req, res, next) => {
  const { email, password } = req.body;
console.log("hi am in login i got email and password:",email,password)
  // Find user by email
  User.findOne({ where: { email } })
      .then(user => {
          if (!user) {
              return res.status(401).json({ message: 'Invalid email or password' });
          }
          console.log("hi im comparing:",password,"with user password:",user.password)
          // Validate password
          bcrypt.compare(password, user.password)
              .then(valid => {
                  if (!valid) {
                    console.log("hi im not valid",valid)
                      return res.status(401).json({ message: 'Invalid email or password' });
                  }
                  console.log('hi am valid')
                  // Generate and return JWT token
                  const token = generateToken(user);
                  res.status(200).json({ token });
                  console.log(res.status)
              })
              .catch(err => {
                  console.log(err);
                  res.status(500).json({ message: 'Internal server error' });
              });
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({ message: 'Internal server error' });
      });
};