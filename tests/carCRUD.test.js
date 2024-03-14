// tests/cars.controller.test.js

const request = require('supertest');
const app = require('../index');
const sequelize = require('../util/database.js');
const Car = require('../models/car');
const CarController = require('../controllers/cars');

//******************************/cars*************************** */

describe('Cars Controller', () => {
    beforeEach(async () => {
        // Clear the 'cars' table before each test
        await Car.destroy({ where: {} });
    });

    afterAll(async () => {
        // Disconnect Sequelize after all tests
        await sequelize.close();
    });

    describe('GET /cars', () => {
        it('should return all cars', async () => {
            // Insert some test data into the 'cars' table
            await Car.bulkCreate([
                { registration_number: 'ABC123', brand: 'Toyota', color: 'Blue', year: '2020' },
                { registration_number: 'DEF456', brand: 'Honda', color: 'Red', year: '2018' }
            ]);

            // Send GET request to /cars endpoint
            const response = await request(app).get('/cars');

            // Assertions
            expect(response.status).toBe(200);
            expect(response.body.cars).toHaveLength(2);
            expect(response.body.cars[0].brand).toBe('Toyota');
            expect(response.body.cars[1].brand).toBe('Honda');
        });

        it('should return an empty array when there are no cars', async () => {
            // Send GET request to /cars endpoint
            const response = await request(app).get('/cars');

            // Assertions
            expect(response.status).toBe(200);
            expect(response.body.cars).toHaveLength(0);
        }); });
       describe('POST /cars', () => {
          it('should create a new car', async () => {
              // Define the car data to be sent in the request body
              const newCarData = {
                  registration_number: 'GHI789',
                  brand: 'Ford',
                  color: 'Black',
                  year: '2019'
              };
      
              // Send POST request to /cars endpoint with the new car data
              const response = await request(app)
                  .post('/cars')
                  .send(newCarData);
      
              // Assertions
              expect(response.status).toBe(201); // Expecting status code 201 for successful creation
              //expect(response.body.message).toBe('Car created successfully!'); // Expecting success message
              expect(response.body.car.registration_number).toBe(newCarData.registration_number); // Expecting the returned car to match the created car
              expect(response.body.car.brand).toBe(newCarData.brand);
              expect(response.body.car.color).toBe(newCarData.color);
              expect(response.body.car.year).toBe(newCarData.year);
          });
      
          it('should return 500 Internal Server Error if an error occurs during creation', async () => {
            console.error = jest.fn(); // Mock console.error to do nothing during the test

            // Mocking an error during car creation
              jest.spyOn(Car, 'create').mockImplementationOnce(() => {
                  throw new Error('Database Error');
              });
      
              // Define the car data to be sent in the request body
              const newCarData = {
                  registration_number: 'GHI789',
                  brand: 'Ford',
                  color: 'Black',
                  year: '2019'
              };
      
              // Send POST request to /cars endpoint with the new car data
              const response = await request(app)
                  .post('/cars')
                  .send(newCarData);
      
              // Assertions
              expect(response.status).toBe(500); // Expecting status code 500 for internal server error
              //expect(response.body.message).toBe('Internal server error'); // Expecting error message
          });
      });
//******************************/cars/carID****************** */     
describe('DELETE /cars/:carId', () => {
  it('should delete a car with the given ID', async () => {
      // Insert a test car into the 'cars' table
      const newCar = await Car.create({
          registration_number: 'GHI789',
          brand: 'Ford',
          color: 'Black',
          year: '2019'
      });

      // Send DELETE request to /cars/:carId endpoint
      const response = await request(app).delete(`/cars/${newCar.id}`);

      // Assertions
      expect(response.status).toBe(200);
      //expect(response.body.message).toBe('Car deleted!');
  });

  it('should return 404 if car with the given ID does not exist', async () => {
      // Send DELETE request to /cars/:carId endpoint with an invalid car ID
      const response = await request(app).delete('/cars/999');

      // Assertions
      expect(response.status).toBe(404);
      //expect(response.body.message).toBe('Car not found!');
  });
});

describe('PUT /cars/:carId', () => {
  it('should update a car with the given ID', async () => {
      // Insert a test car into the 'cars' table
      const newCar = await Car.create({
          registration_number: 'GHI789',
          brand: 'Ford',
          color: 'Black',
          year: '2019'
      });

      // Define the updated car data
      const updatedCarData = {
          registration_number: 'XYZ123',
          brand: 'Updated Brand',
          color: 'Updated Color',
          year: '2020'
      };

      // Send PUT request to /cars/:carId endpoint with the updated car data
      const response = await request(app)
          .put(`/cars/${newCar.id}`)
          .send(updatedCarData);

      // Assertions
      expect(response.status).toBe(200);
      //expect(response.body.message).toBe('Car updated!');
      expect(response.body.car.registration_number).toBe(updatedCarData.registration_number);
      expect(response.body.car.brand).toBe(updatedCarData.brand);
      expect(response.body.car.color).toBe(updatedCarData.color);
      expect(response.body.car.year).toBe(updatedCarData.year);
  });

  it('should return 404 if car with the given ID does not exist', async () => {
      // Send PUT request to /cars/:carId endpoint with an invalid car ID
      const response = await request(app).put('/cars/999').send({});

      // Assertions
      expect(response.status).toBe(404);
      //expect(response.body.message).toBe('Car not found!');
  });
});


  
});


        /*it('should handle errors', async () => {
          jest.setTimeout(10000); // Set the timeout to 10 seconds (10000 milliseconds)

          // Mocking an error in the Car.findAll() method
          jest.spyOn(Car, 'findAll').mockRejectedValue(new Error('Database error'));
      
          // Send GET request to /cars endpoint
          const response = await request(app).get('/cars');
      
          // Assertions
          expect(response.status).toBe(500);
          expect(response.body.message).toBe('Database error');
      
          // Restore the original implementation of Car.findAll() after the test
          Car.findAll.mockRestore(); // This ensures that subsequent tests will not be affected by the mock
      });*/
/*
describe('CRUD Operations for Car Resource', () => {
  let testCarId;
  let testAgencyId;

  // Before running tests, create a test agency and a test car
  beforeAll(async () => {
    const testAgency = await Agency.create({ name: 'Test Agency' });
    testAgencyId = testAgency.id;

    const testCar = await Car.create({
      registration_number: '123ABC',
      brand: 'Test Brand',
      color: 'Test Color',
      year: 2020,
      agencyId: testAgencyId
    });
    testCarId = testCar.id;
  });

  // After running tests, clean up test data
  afterAll(async () => {
    await Car.destroy({ where: {}, truncate: true });
    await Agency.destroy({ where: {}, truncate: true });
  });

  // Test for GET all cars endpoint
  describe('GET /cars', () => {
    test('should return all cars', async () => {
      const response = await request(app).get('/cars');
      expect(response.status).toBe(200);
      expect(response.body.cars.length).toBeGreaterThan(0);
    });

    test('should return cars with correct properties', async () => {
      const response = await request(app).get('/cars');
      const car = response.body.cars[0];
      expect(car).toHaveProperty('id');
      expect(car).toHaveProperty('registration_number');
      expect(car).toHaveProperty('brand');
      expect(car).toHaveProperty('color');
      expect(car).toHaveProperty('year');
      expect(car).toHaveProperty('agencyId');
    });

    test('should return 404 if no cars found', async () => {
      await Car.destroy({ where: {}, truncate: true });
      const response = await request(app).get('/cars');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('No cars found');
    });
  });

  // Test for GET car by ID endpoint
  describe('GET /cars/:carId', () => {
    test('should return a specific car by ID', async () => {
      const response = await request(app).get(`/cars/${testCarId}`);
      expect(response.status).toBe(200);
      expect(response.body.car.id).toBe(testCarId);
    });

    test('should return 404 if car ID does not exist', async () => {
      const response = await request(app).get('/cars/9999');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Car not found');
    });

    test('should return 400 if invalid car ID format', async () => {
      const response = await request(app).get('/cars/invalidId');
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid car ID format');
    });
  });

  // Test for POST car endpoint
  describe('POST /cars', () => {
    test('should create a new car', async () => {
      const newCarData = {
        registration_number: '456DEF',
        brand: 'New Brand',
        color: 'New Color',
        year: 2022,
        agencyId: testAgencyId
      };
      const response = await request(app).post('/cars').send(newCarData);
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Car created successfully!');
      expect(response.body.car.registration_number).toBe(newCarData.registration_number);
    });

    test('should return 400 if missing required fields', async () => {
      const response = await request(app).post('/cars').send({});
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing required fields');
    });

    test('should return 500 if internal server error', async () => {
      const response = await request(app).post('/cars').send({ invalidData: 'invalid' });
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });
  });

  // Test for PUT car endpoint
  describe('PUT /cars/:carId', () => {
    test('should update an existing car', async () => {
      const updatedCarData = {
        registration_number: '789GHI',
        brand: 'Updated Brand',
        color: 'Updated Color',
        year: 2023,
        agencyId: testAgencyId
      };
      const response = await request(app).put(`/cars/${testCarId}`).send(updatedCarData);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Car updated!');
      expect(response.body.car.registration_number).toBe(updatedCarData.registration_number);
    });

    test('should return 404 if car ID does not exist', async () => {
      const updatedCarData = {
        registration_number: '789GHI',
        brand: 'Updated Brand',
        color: 'Updated Color',
        year: 2023,
        agencyId: testAgencyId
      };
      const response = await request(app).put('/cars/9999').send(updatedCarData);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Car not found!');
    });

    test('should return 400 if invalid car ID format', async () => {
      const response = await request(app).put('/cars/invalidId').send({});
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid car ID format');
    });
  });

  // Test for DELETE car endpoint
  describe('DELETE /cars/:carId', () => {
    test('should delete an existing car', async () => {
      const response = await request(app).delete(`/cars/${testCarId}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Car deleted!');
    });

    test('should return 404 if car ID does not exist', async () => {
      const response = await request(app).delete('/cars/9999');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Car not found!');
    });

    test('should return 400 if invalid car ID format', async () => {
      const response = await request(app).delete('/cars/invalidId');
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid car ID format');
    });
  });
});
*/