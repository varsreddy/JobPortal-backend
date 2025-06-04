import {Company} from "../models/company.model.js";

import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req,res)=>{
    try{
        const {companyName} = req.body;
        if(!companyName){
            return res.status(400).json({message:"Company name is required!",success:false});
        }
        let company = await Company.findOne({name:companyName});
        if(company){
            return res.status(400).json({message:"You can't register same company.",success:false});
        };
        company = await Company.create({
            name:companyName,
            userId:req._id,
        });

        return res.status(201).json({
            message:"Company registered successfully",
            success:true,
            company
        });
    }catch(err){
        console.log(err);
    }
}


export const getCompany = async (req,res)=>{
    try {
        const userId = req._id; //logged in user id
        const companies = await Company.find({userId});
        if(!companies){
            return res.status(400).json({message:"No company found",success:false});
        }

        return res.status(200).json({
            message:"Companies found",
            success:true,
            companies
        });
    } catch (error) {
        console.log(error);
    }
}

//get company by id

export const getCompanyById = async (req,res)=>{
    try {
        const companyId = req.params.id; //company id
        const company = await Company.findById(companyId);
        if(!company){
            return res.status(400).json({message:"No company found",success:false});
        }

        return res.status(200).json({
            message:"Company found",
            success:true,
            company
        }); 
        } catch (error) {
        console.log(error);
    }
}

export const updateCompany = async (req,res)=>{
    
    try {
        const {name,description,website,location} = req.body;
        const file = req.file; //logo
        // cloudinary code here
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        const logo = cloudResponse.secure_url;
        

        const updateData = {
            name,
            description,
            website,
            location,
            logo
        };

        const company = await Company.findByIdAndUpdate(req.params.id,updateData,{new:true});

        if(!company){
            return res.status(404).json({message:"Company not found",success:false});
        }

        return res.status(200).json({
            message:"Company updated successfully",
            success:true,
            company
        });
    } catch (error) {
        console.log(error);
    }
}