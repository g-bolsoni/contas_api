const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const billsController = require('./controllers/billsController');
const filterController = require('./controllers/filterController');
const userController = require('./controllers/usersController');

//Bills
router.get('/bills', billsController.index);
router.get('/bills/:id', billsController.findOne);
router.post('/bills', billsController.createBills);
router.put('/bills/:id', billsController.updateBills);
router.delete('/bills/:id', billsController.deleteBills);
router.delete('/bills/', billsController.deleteAllBills);

// Bills filters
router.post('/filter', billsController.filterBills);
router.get('/filter', filterController.getData);

// User
router.post('/auth/register', userController.registerUser);
router.post('/auth/login', userController.loginUser);
router.get('/user/:id', verifyToken, userController.getUserLogged);

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({
      message: 'No token provided'
    });
  }

  try {
    jwt.verify(token, process.env.SECRET);
    next();

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Invalid token' });
  }

}

module.exports = router;