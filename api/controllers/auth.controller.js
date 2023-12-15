import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
 
export const signup=async (req,res,next)=>{
    const{username,email,password}=req.body;
    const hashedPassword= bcryptjs.hashSync(password,10);
    const newUser=new User({username,email,password:hashedPassword}); 
    try {
        await  newUser.save();
        res.status(201).json("User created succesfully!");
    } catch (error) {
        // res.status(500).json(error.message) 
        //calls the middleware in index.js
        next(error);

        // when we want to create a error use this i.e if a error is not thrown but still its a error
        // next(errorHandler(550,'error from the function'))
    }
}
