import User from "../models/User.js";
import jwt from 'jsonwebtoken';

//Here Checking if user request is Authorized. Also Protecting user Password 
export const protectRoute = async (req,res,next) => {
    try {
        const token = req.cookies.jwt;

        if(!token)
            return res.status(401).json({success:false , message :" Unauthorized - No token Provided"});

        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);

        if(!decoded){
            return res.status(401).json({success:false , message :" Unauthorized - Invalid Token"});
        }

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(401).json({success:false , message :" Unauthorized - User Not Found"});
        }

        req.user = user;
        next()
    } catch (error) {
        console.log("error in Portecting Middle Ware Route",error.message);
        res.json({sucess:false, message:"Internal Server Error"});
    }
}