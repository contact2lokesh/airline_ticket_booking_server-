const router = require("express").Router();
const {jwtUserAuthorization} = require("../middleware/authorization");
const {flights, bookFlight} = require("../controller/bookFLightController");

router.route('/flights').get(jwtUserAuthorization, flights);
router.route('/bookings').post(jwtUserAuthorization, bookFlight);


module.exports = router;