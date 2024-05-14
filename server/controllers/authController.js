import User from "../models/usersSchema";
import bcrypt from "bcryptjs";
import { jwt } from "jsonwebtoken";

export const signUp = async(req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            return next(res.send("User already Exits!"));
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const newUser = await User.create({
            ...req.body,
            password: hashedPassword
        });
        const token = jwt.sign({ _id: newUser._id }, 'secretkey123', {
            expiresIn: '90d',
        });
        res.status(201).json({
            status: 'success',
            message: 'User SIgned In Successfully',
            token,
        })
    } catch (error) {
        console.log("Error Occured!", error);        
    }
}