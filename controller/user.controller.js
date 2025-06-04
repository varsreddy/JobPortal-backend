import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req,res)=>{
    try{
        const {fullname,email,phoneNumber,password,role} = req.body;
        if(!fullname || !email || !phoneNumber || !password || !role){
            return res.status(400).json({message:"All fields are required",success:false});
        }
        const user = await User.findOne({email});


        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        
        // const cloudResponse = await cloudinary.uploader.upload(fileUri.content,{
        //     resource_type:'auto', 
        // });

        // const cloudResponse = await cloudinary.uploader.upload(fileUri.content).catch((error) => {
        //     console.error("Cloudinary upload failed:", error);
        //     return res.status(500).json({ message: "Error uploading file to Cloudinary", success: false });
        // });


//         const file = req.file;
// if (file) {
//     const fileUri = getDataUri(file);
//     try {
//         const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
//         if (!cloudResponse || !cloudResponse.secure_url) {
//             return res.status(500).json({ message: 'Error uploading file to Cloudinary', success: false });
//         }
//         return cloudResponse;
//     } catch (error) {
//         console.log("Cloudinary upload failed:", error);
//         return res.status(500).json({ message: "Error uploading file to Cloudinary", success: false });
//     }
// }
        
        if(user){
            return res.status(400).json({message:"User already exists",success:false});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        await User.create({
            fullname,
            email,
            phoneNumber,
            password:hashedPassword,
            role,
            profile:{
                profilePhoto:cloudResponse.secure_url,
            }
        });

        return res.status(201).json({message:"Account created successfully",success:true});
    }catch(err){
        return res.status(500).json({message:"Internal server error",success:false});
    }
}


export const login = async (req,res)=>{
    try{
        const {email,password,role} = req.body;
        if(!email || !password || !role){
            return res.status(400).json({message:"All fields are required",success:false});
        }
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid credentials",success:false});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials",success:false});
        }
        if(role !== user.role){
            return res.status(400).json({message:"Account doesn't exist with current role",success:false});
        }
        const tokenData = {
            userid:user._id,
        }

        user = {
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile,
        }

        //jwt.sign(payload,secretkey,options)   
        const token = await jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:"1d"});
        return res.cookie("token",token,{maxAge:1*24*60*60*1000,httpOnly:true,sameSite:'strict'})
        .status(200).json(
            {
                message:`Welcome back ${user.fullname}`,
                user,success:true
            });
    }catch(err){
        console.log("Error in Login: ",err);
        // return res.status(500).json({message:"Internal server error",success:false});
    }
}

export const logout = async (req,res)=>{
    try{
        return res.status(200).cookie("token","",{maxAge:0}).json({message:"Logout successfully",success:true});
    }catch(err){
        console.log(err);
        // return res.status(500).json({message:"Internal server error",success:false});
    }
}

export const updateProfile = async (req,res)=>{
    try{
        const {fullname,email,phoneNumber,bio,skills} = req.body;
        // console.log("upload file: ",req.file);
        const file = req.file;
        const fileUri = getDataUri(file);
        // console.log("File URI content:", fileUri.content);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        //cloudinary upload


        let skillsArray;
        if(skills){
            skillsArray = skills.split(",");
        }
        
        const userId = req._id; // from middleware
        let user = await User.findById(userId);
        if(!user){
            return res.status(400).json({
                message:"User not found",
                success:false
            });
        }
        //updating data
        if(fullname) user.fullname = fullname;
        if(email) user.email = email;
        if(phoneNumber) user.phoneNumber = phoneNumber;
        if(bio) user.profile.bio = bio;
        if(skills) user.profile.skills = skillsArray;

        //resume comes later here
        if (!cloudResponse || !cloudResponse.secure_url) {
            return res.status(500).json({ message: 'Error uploading file to Cloudinary', success: false });
        }
        if(cloudResponse){
            user.profile.resume = cloudResponse.secure_url //save the cloudinary url
            user.profile.resumeOriginalName = file.originalname //save the original name
        }

        await user.save();
        user = {
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile,
        }
        return res.status(200).json({message:"Profile updated successfully",user,success:true});
    }catch(err){                                                      
        console.log(err);
    }
}