const router = require("express").Router();
const pool = require("../db");
const authorize = require("../middleware/authorization");


router.get("/",authorize, async (req,res) => {
    try {
        // res.json(req.user);

        const user = await pool.query("SELECT user_name,user_email FROM users WHERE user_id = $1",[req.user]);

        res.json(user.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server Error");
    }
});

module.exports = router;

