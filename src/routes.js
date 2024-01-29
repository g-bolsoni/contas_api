const express = require('express');
const router = express.Router();
const billsController = require('./controllers/billsController');
const googleController = require('./controllers/googleController');
const filterController = require('./controllers/filterController');

router.get('/planilha', googleController.get);
router.post('/planilha', googleController.postData);


router.get('/bills', billsController.index);
router.get('/bills/:id', billsController.findOne);
router.post('/bills', billsController.createBills);
router.put('/bills/:id', billsController.updateBills);
router.delete('/bills/:id', billsController.deleteBills);
router.delete('/bills/', billsController.deleteAllBills);


router.post('/filter', billsController.filterBills);
router.get('/filter', filterController.getData);
router.get('/filter/totalExpenses', filterController.getTotalExpenses);


module.exports = router;