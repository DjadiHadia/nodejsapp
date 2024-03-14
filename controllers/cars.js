const Car = require('../models/car');
const Agency = require('../models/agency');

// CRUD Controllers

//get all users
exports.getCars = (req, res, next) => {
    Car.findAll()
        .then(cars => {
            res.status(200).json({ cars: cars });
        })
        .catch(err => console.log(err));
        
}

//get user by id
exports.getCar = (req, res, next) => {
  const { carId } = req.params;

  if (carId) {
      // If carId is provided, find the specific car
      Car.findByPk(carId)
          .then(car => {
              if (!car) {
                  return res.status(404).json({ error: 'Car not found' });
              }
              res.status(200).json({ car: car });
          })
          .catch(err => {
              console.log(err);
              res.status(500).json({ error: 'Internal server error' });
          });
  } 
}


exports.createCarWithAgency = async (req, res, next) => {
  const { registration_number, brand, color, year } = req.body;
  const { agencyId } = req.params; // Corrected: Destructure agencyId from req.params
  try {
      // Check if the agency exists
      const agency = await Agency.findByPk(agencyId);
      if (!agency) {
          return res.status(404).json({ message: 'Agency not found' });
      }

      // Create the car
      const car = await Car.create({
          registration_number,
          brand,
          color,
          year,
          agencyId
      });

      res.status(201).json({
          message: 'Car created successfully!',
          car
      });
  } catch (error) {
      console.error('Error creating car:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};


exports.createCar = async (req, res, next) => {
  const { registration_number, brand, color, year } = req.body;

  try {
   

      // Create the car
      const car = await Car.create({
          registration_number,
          brand,
          color,
          year
      });

      res.status(201).json({
          message: 'Car created successfully!',
          car
      });
  } catch (error) {
      console.error('Error creating car:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};
//delete user
exports.deleteCar = (req, res, next) => {
  const carId = req.params.carId;
  Car.findByPk(carId)
    .then(car => {
      if (!car) {
        return res.status(404).json({ message: 'car not found!' });
      }
      return Car.destroy({
        where: {
          id: carId
        }
      });
    })
    .then(result => {
      res.status(200).json({ message: 'car deleted!' });
    })
    .catch(err => console.log(err));
}

//update user
exports.updateCar = (req, res, next) => {
  const carId = req.params.carId;
  const updatedregistration_number = req.body.registration_number;
  const updatedbrand = req.body.brand;
  const updatedcolor = req.body.color;
  const updatedyear = req.body.year;
 

  Car.findByPk(carId)
    .then(car => {
      if (!car) {
        return res.status(404).json({ message: 'Car not found!' });
      }
      car.registration_number = updatedregistration_number;
      car.brand = updatedbrand;
      car.color = updatedcolor;
      car.year = updatedyear;
      
     
      return car.save();
    })
    .then(result => {
      res.status(200).json({message: 'Car updated!', car: result});
    })
    .catch(err => console.log(err));
}

exports.getCarsByAgency = async (req, res) => {
  const { agencyId } = req.params;

  try {
      // Check if the agency exists
      const agency = await Agency.findByPk(agencyId);
      if (!agency) {
          return res.status(404).json({ message: 'Agency not found' });
      }

      // Find all cars belonging to the specified agencyId
      const cars = await Car.findAll({ where: { agencyId } });

      if (!cars || cars.length === 0) {
          return res.status(404).json({ message: 'No cars found for the specified agency' });
      }

      res.status(200).json(cars);
  } catch (error) {
      console.error('Error fetching cars by agency:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};