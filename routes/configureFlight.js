const router = require("express").Router();
const {jwtAdminAuthorization} = require("../middleware/authorization");
const {flightRoute, flightConfiguration, flightDetails} = require("../controller/configureFlightController");

router.route('/flight-route').post(jwtAdminAuthorization, flightRoute);
router.route('/flight-configuration').post(jwtAdminAuthorization, flightConfiguration);
router.route('/add-flight').post(jwtAdminAuthorization, flightDetails);

module.exports = router;