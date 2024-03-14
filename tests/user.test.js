const request = require('supertest');
const app = require('../index');
const sequelize = require('../util/database.js');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
describe('User Controller', () => {
    beforeEach(async () => {
        // Clear the 'users' table before each test
        await User.destroy({ where: {} });
    });

    afterAll(async () => {
        // Disconnect Sequelize after all tests
        await sequelize.close();
    });

    describe('POST /users/register', () => {
        it('should register a new user', async () => {
            // Define the user data to be sent in the request body
            const newUser = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password'
            };

            // Send POST request to /users/register endpoint with the new user data
            const response = await request(app)
                .post('/users/register')
                .send(newUser);

            // Assertions
            expect(response.status).toBe(201); // Expecting status code 201 for successful registration
            expect(response.body.message).toBe('User created successfully'); // Expecting success message
            expect(response.body.token).toBeDefined(); // Expecting JWT token
        });

        it('should return 500 Internal Server Error if an error occurs during registration', async () => {
            // Mocking an error during user creation
            jest.spyOn(User, 'create').mockImplementationOnce(() => {
                throw new Error('Database Error');
            });

            // Define the user data to be sent in the request body
            const newUser = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password'
            };

            // Send POST request to /users/register endpoint with the new user data
            const response = await request(app)
                .post('/users/register')
                .send(newUser);

            // Assertions
            expect(response.status).toBe(500); // Expecting status code 500 for internal server error
            //expect(response.body.message).toBe('Internal server error'); // Expecting error message
        });
    });

    describe('POST /users/login', () => {
        it('should login a registered user', async () => {
            // Hash the password
const hashedPassword = await bcrypt.hash('secret', 10);

// Create user using hashed password
await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: hashedPassword
});
          
            const createdUser = await User.findOne({ where: { email: 'test@example.com' } });
expect(createdUser).toBeDefined(); // Expecting the user to be defined in the database

            // Define the login data to be sent in the request body
            const loginData = {
                email: 'test@example.com',
                password: 'secret'
            };

            // Send POST request to /users/login endpoint with the login data
            const response = await request(app)
                .post('/users/login')
                .send(loginData);
            
            // Assertions
            expect(response.status).toBe(200); // Expecting status code 200 for successful login
            expect(response.body.token).toBeDefined(); // Expecting JWT token
        });

        it('should return 401 Unauthorized if login credentials are incorrect', async () => {
            // Define incorrect login data
            const incorrectLoginData = {
                email: 'test@example.com',
                password: 'incorrectpassword'
            };

            // Send POST request to /users/login endpoint with incorrect login data
            const response = await request(app)
                .post('/users/login')
                .send(incorrectLoginData);

            // Assertions
            expect(response.status).toBe(401); // Expecting status code 401 for unauthorized
            //expect(response.body.message).toBe('Invalid email or password'); // Expecting error message
        });
    });
});
