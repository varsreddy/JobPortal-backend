import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJob = async (req, res) => {
    try{
        const userId = req._id;
        const jobId = req.params.id;
        // const {id:jobId} = req.params; //above and this commands are same
        if(!jobId){
            return res.status(400).json({message:"Job id is required",success:false});
        }

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID is missing", success: false });
        }

        //check if the user has already applied for the job
        const existingApplication = await Application.findOne({applicant:userId,job:jobId});
        if(existingApplication){
            return res.status(400).json({message:"You have already applied for this job",success:false});
        }
        
        //check if the job exists
        const job = await Job.findById(jobId);
        if(!job){
            return res.status(400).json({message:"Job not found",success:false});
        }

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID is missing", success: false });
        }

        //create new application
        const newApplication = await Application.create({
            job:jobId,
            applicant:userId
        });

        job.applications.push(newApplication._id);
        await job.save(); //save the job with new application id
        return res.status(200).json({
            success:true,
            message:"Application submitted successfully",
        });
    }catch(error){
        console.log(error);
    }
}


export const getAppliedJobs = async (req, res) => {
    try{
        const userId = req._id;
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:"job",
            options:{sort:{createdAt:-1}},
            populate:{
                path:"company",
                options:{sort:{createdAt:-1}}
            }
        });

        if(!application){
            return res.status(400).json({message:"No applications found",success:false});
        }

        return res.status(200).json({
            success:true,
            application
        });
    }catch(error){
        console.log(error);
    }
}

//admin can see all the applications for a job
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"applications",
            options:{sort:{createdAt:-1}},
            populate:{
                path:"applicant",
                options:{sort:{createdAt:-1}}
            }
        })

        if(!job){
            return res.status(400).json({message:"No job found",success:false});
        }
        // if(!job.application.length){
        //     return res.status(400).json({message:"No applications found",success:false});
        // }

        return res.status(200).json({
            success:true,
            job
        });
    } catch (error) {
        console.log(error);
    }
}

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body; //status can be accepted or rejected
        const applicationId = req.params.id; //application id from params

        if(!status){
            return res.status(400).json({message:"Status Id is required",success:false});
        }

        const application = await Application.findOne({_id:applicationId}); //find the application by id
        if(!application){
            return res.status(400).json({message:"Application not found",success:false});
        }

        application.status = status.toLowerCase(); //update the status of the application
        await application.save(); //save the application
        
        return res.status(200).json({
            success:true,
            message:"Application status updated successfully",
        });
    } catch (error) {
        console.log(error);
    }
}