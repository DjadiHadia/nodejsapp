const controller = require('../controllers/cars');
const router = require('express').Router();

// CRUD Routes /cars
//1st endpoint
router.get('/', controller.getCars);
router.post('/', controller.createCar);
//2nd endpoint
router.get('/:carId', controller.getCar); 
router.put('/:carId', controller.updateCar); 
router.delete('/:carId', controller.deleteCar);


module.exports = router;