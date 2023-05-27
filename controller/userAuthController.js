const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");

const userRegistration = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // get user details if user exist //
        const user = await pool.query("SELECT * from users WHERE user_name = $1", [name]);

        if (user.rows.length !== 0) {

            res.status(401).send({ message: "User Already exists." });
        } else {
            // hash password //
            const saltRound = 10;
            const salt = await bcrypt.genSalt(saltRound);
            const bycrptPassword = await bcrypt.hash(password, salt);

            // add new user in user table databse //
            const newUser = await pool.query(
                "INSERT INTO users (role, user_name, user_email, user_password) VALUES ($1, $2, $3, $4) RETURNING *", ['user', name, email, bycrptPassword]
            );

            // get JWT Token //
            const token = jwtGenerator(newUser.rows[0].user_id);

            res.status(200).json({ message: "Registered Successfully", token: token });
        }

    } catch (error) {
        console.error("Error at Registration", error);
        res.status(500).json({ message: 'An internal server error occurred' });
    }
}

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        // check user exist in users database or not //
        const user = await pool.query("SELECT * FROM users WHERE user_email  = $1", [email]);

        // if user doesn't exist //
        if (user.rows.length === 0) {

            res.status(401).json({ message: "Password or Email is incorrect." });

        } else {
            const validPassword = await bcrypt.compare(password, user.rows[0].user_password);

            // if password is Invalid //
            if (!validPassword) {
                res.status(401).json({ message: "Incorrect Password." });
            } else {
                const token = jwtGenerator(user.rows[0].user_id);

                res.status(200).json({ message: "Login Success.", token: token });
            }
        }

    } catch (error) {
        console.error("Error at Login", error);
        res.status(500).json({ message: 'An internal server error occurred' });

    }
}

const getDetails = async(req, res)=>{
    try {
       console.log(req.user);
       const useretails= await pool.query("SELECT * FROM users WHERE user_id  = $1", [req.user]);

       res.status(200).json(useretails.rows[0]);
    } catch (error) {
       res.status(500).json(error); 
    }
}

module.exports = { userRegistration, userLogin, getDetails };