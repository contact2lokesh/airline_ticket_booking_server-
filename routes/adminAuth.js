const router = require("express").Router(); 
const validInfo = require("../middleware/validInfo");
const {adminRegistration, adminLogin} = require("../controller/adminAuthController");

router.route('/register').post(validInfo, adminRegistration);
router.route('/login').post(validInfo, adminLogin);

module.exports = router;