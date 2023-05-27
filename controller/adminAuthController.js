const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");


const adminRegistration = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // get admin details if admin exist //
        const user = await pool.query("SELECT * from admin WHERE admin_name = $1", [name]);

        if (user.rows.length !== 0) {

            res.status(401).send({ message: "Admin Already exists." });
        } else {
            // hash password //
            const saltRound = 10;
            const salt = await bcrypt.genSalt(saltRound);
            const bycrptPassword = await bcrypt.hash(password, salt);

            // add new admin in admin table databse //
            const newUser = await pool.query(
                "INSERT INTO admin (role, admin_name, admin_email, admin_password) VALUES ($1, $2, $3, $4) RETURNING *", ['admin', name, email, bycrptPassword]
            );

            // get JWT Token //
            const token = jwtGenerator(newUser.rows[0].admin_id);

            res.status(200).json({ message: "Registered Successfully", token: token });
        }

    } catch (error) {
        console.error("Error at Registration", error);
        res.status(500).json({ error: 'An internal server error occurred' });
    }
}

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        // check acmin exist in admin database or not //
        const user = await pool.query("SELECT * FROM admin WHERE admin_email  = $1", [email]);

        // if admin doesn't exist //
        if (user.rows.length === 0) {

            res.status(401).json({ message: "Password or Email is incorrect." });

        } else {
            const validPassword = await bcrypt.compare(password, user.rows[0].admin_password);

            // if password is Invalid //
            if (!validPassword) {
                res.status(401).json({ message: "Incorrect Password." });
            } else {
                const token = jwtGenerator(user.rows[0].admin_id);

                res.status(200).json({ message: "Login Success.", token: token });
            }
        }

    } catch (error) {
        console.error("Error at Login", error);
        res.status(500).json({ message: 'An internal server error occurred' });

    }
}


module.exports = {adminRegistration, adminLogin}