
const router = require("express").Router();
const {userRegistration, userLogin, getDetails} = require("../controller/userAuthController");
const validInfo = require("../middleware/validInfo");
const {jwtUserAuthorization} = require("../middleware/authorization");


router.route('/register').post(validInfo, userRegistration);
router.route('/login').post(validInfo, userLogin);
router.route('/get-details').get(jwtUserAuthorization, getDetails);

module.exports = router;