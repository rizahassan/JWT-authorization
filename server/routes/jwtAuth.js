const router = require("express").Router()
const pool = require("../db")
const bcrypt = require("bcrypt")
const jwtGenerator = require("../utils/jwtGenerator")
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");

// Registering

router.post("/register",validInfo, async(req,res) => {
    try{

        //1. destructors the req.body (name,email,password)

        const {name, email, password } = req.body;

        //2. check if user exists (if user exist theen throw error)

        const user = await pool.query("SELECT * FROM users WHERE user_email = $1",[email]);

        //Error 401 - Person is Unauthenticated
        if(user.rows.length !==0){
            return res.status(401).send("User already exists")
        }


        //3. Bcrypt the user password

        const saltRound =10;
        const salt = await bcrypt.genSalt(saltRound);

        const bcryptPassword = await bcrypt.hash(password,salt);

        //4. Enter the new user inside the database

        const newUser = await pool.query("INSERT INTO users (user_name,user_email,user_password) VALUES($1,$2,$3) RETURNING *",[name, email,bcryptPassword] );

        //5. Generating our JWT token

        const token = jwtGenerator(newUser.rows[0].user_id);

        res.json({token});

    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})
// Login Router
router.post("/login", validInfo, async(req,res) => {
try{

    //1. destructure the req.body

    const {email, password } = req.body;

    //2. Check if user does not exist (if not then we throw error)

    const user = await pool.query("SELECT * FROM users WHERE user_email =$1",[email]);

    if(user.rows.length === 0){
        return res.status(401).send("Email or Password is incorrect");
    }

    //3. Check if incoming password is the same as the database password

    const isValidPassword = await bcrypt.compare(password,user.rows[0].user_password);

    if(!isValidPassword){
        return res.status(401).json("Email or Password is incorrect");
    }

    //4. Give them the jwt token

    const token = jwtGenerator(user.rows[0].user_id);

    res.json({token});


}catch(err){
    console.error(err.message);
    res.status(500).send("Server Error");
}
});

router.get("/is-verify",authorization, async(req,res) =>{
    try {
        res.json(true);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});
module.exports = router;