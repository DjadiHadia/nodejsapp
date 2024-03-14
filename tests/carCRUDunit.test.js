// Import the required modules and functions
const Car = require('../models/car');
const CarController = require('../controllers/cars');

// Mock the response object
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};


// Mock the Car.findAll function
jest.mock('../models/car', () => ({
    findAll: jest.fn(),
    findByPk: jest.fn(),
    destroy: jest.fn(),



}));

describe('getCars', () => {
    test('should return all cars', async () => {
        const req = {};
        const res = mockResponse();
        const fakeCars = [{ id: 1, make: 'Toyota', model: 'Camry' }, { id: 2, make: 'Honda', model: 'Civic' }];
        
        // Mocking the behavior of Car.findAll
        Car.findAll.mockResolvedValue(fakeCars);

        // Call the controller function
        await CarController.getCars(req, res);

        // Check if the response is as expected
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ cars: fakeCars });
    });

   
});

//************2nden point */
/*
// Mock the response object
const mockResponse2 = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

// Mock the necessary objects and functions
const mockRequest2 = (params = {}, body = {}) => ({
  params,
  body
});

//For deleteCar test
it('should delete a car with the given ID', async () => {
    const req = mockRequest2({ params: { carId: 1 } });
    const res = mockResponse2();

    // Mocking the behavior of findByPk and destroy methods
    //const Car = require('../models/car'); // require the mocked Car model
    Car.findByPk.mockResolvedValueOnce({ id: 1 }); // Mocking a car with ID 1
    Car.destroy.mockResolvedValueOnce(1);

    await CarController.deleteCar(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    // No need to expect res.json here
});

// For updateCar test
it('should update a car with the given ID', async () => {
    const req = mockRequest2({ params: { carId: 1 } }, {
        registration_number: 'Updated registration number',
        brand: 'Updated brand',
        color: 'Updated color',
        year: 'Updated year',
        agencyId: 1
    });
    const res = mockResponse2();

    // Mocking the behavior of findByPk
    const Car = require('../models/car'); // require the mocked Car model
    const mockedCar = { 
        id: 1, 
        registration_number: 'Old registration number',
        brand: 'Old brand',
        color: 'Old color',
        year: 'Old year',
        agencyId: 1,
        save: jest.fn() 
    };
    Car.findByPk.mockResolvedValueOnce(mockedCar);

    await CarController.updateCar(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    // No need to expect res.json here
});*/