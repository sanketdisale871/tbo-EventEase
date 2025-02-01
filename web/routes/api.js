const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");
const { requireUserAuth } = require("../middleware/auth");

router.post('/register', userController.register);
router.post('/login', userController.login)
router.get('/itinerary/:itineraryid', userController.renderItinerary);



module.exports = router;
