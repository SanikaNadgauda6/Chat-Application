import express from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/usersSchema.js';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


const router = express.Router();
router.use(express.json());
dotenv.config(); 


router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    console.log("hellooo", username, email, password);

    const existingUser  = await User.findOne({ email });

    if (existingUser ) {
        return res.json({ message: "User Already Exists!" });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        username,
        email,
        password: hashpassword
    });
    await newUser.save();
    return res.json({ status: true , message: "User registered Successfully" });
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log("hellooo", email, password);

    const user  = await User.findOne({ email });

    if (!user ) {
        return res.json({ message: "User is not Registered!" });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        return res.json({ message: "Incorrect Password! Please try again." });
    }

    const token = jwt.sign({ username: user.username }, process.env.KEY, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, maxAge: 360000 });
    return res.json({status: true, message: "Login Successful!"});

});


const checkAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log("This is Token", token);
        if (!token) {
            return res.json({ status: false, message: "No token" })
        }
        const decoded = await jwt.verify(token, process.env.KEY);
        // Access user information from the decoded payload
        const username = decoded.username;
        console.log("Username is thisss", username);
        // Set the user property on the request object
        req.user = { username: username };
        // Perform actions or checks based on the user information
        console.log("Authenticated user:", decoded);
        next();
    }
    catch (err) {
        return res.json(err);
    }
}




router.get('/check-auth', checkAuth, (req, res) => {
    console.log("This is user:::", req.user);
    const user = req.user;
    console.log("This is user:::",user)
    return res.json({ status: true, authenticated: true, user: user });
});



router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        return res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ status: true });
})

export {router as UserRouter}