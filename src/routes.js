const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const billsController = require("./controllers/billsController");
const filterController = require("./controllers/filterController");
const userController = require("./controllers/usersController");
const categoryControler = require("./controllers/categoriesController");

// Middleware para autenticação
const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user_id = decoded.id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Invalid token" });
  }
};

//Bills
router.get("/bills", verifyToken, billsController.index);
router.get("/bills/:id", verifyToken, billsController.findOne);
router.post("/bills", verifyToken, billsController.createBills);
router.put("/bills/:id", verifyToken, billsController.updateBills);
router.delete("/bills/:id", verifyToken, billsController.deleteBills);
router.delete("/bills/", verifyToken, billsController.deleteAllBills);

// Bills filters
router.post("/filter", verifyToken, billsController.filterBills);
router.get("/filter", filterController.getData);

// User
router.post("/auth/register", userController.registerUser);
router.post("/auth/login", userController.loginUser);
router.get("/user/:id", verifyToken, userController.getUserLogged);

//Categories
router.get("/category", verifyToken, categoryControler.getCategories);
router.post("/category", verifyToken, categoryControler.createCategory);

module.exports = router;
