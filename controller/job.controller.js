import { Job } from "../models/job.model.js";

//admin will posts this jobs
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      salary,
      companyId,
      requirements,
      jobType,
      position,
      experience,
    } = req.body;
    const userId = req._id; //user id from token

    if (
      !title ||
      !description ||
      !location ||
      !salary ||
      !companyId ||
      !requirements ||
      !jobType ||
      !position ||
      !experience
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const requirementsArray = Array.isArray(requirements)
      ? requirements
      : requirements.split(",").map((req) => req.trim());

    const job = await Job.create({
      title,
      description,
      location,
      salary: Number(salary),
      company: companyId,
      requirements: requirementsArray,
      jobType,
      position,
      experience: Number(experience),
      created_by: userId,
    });
    return res
      .status(201)
      .json({ message: "New job posted successfully", success: true, job });
  } catch (error) {
    console.log(error);
  }
};

// students can apply for job
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || ""; //keyword for search
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    const jobs = await Job.find(query)
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 });
    if (!jobs) {
      return res.status(400).json({ message: "No jobs found", success: false });
    }

    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.log(error);
  }
};

// get all jobs by company id -- student
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id; //job id from params
    const job = await Job.findById(jobId).populate({
      path: "applications",
    }); //populate company details
    if (!job) {
      return res.status(400).json({ message: "No job found", success: false });
    }

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.log(error);
  }
};

// get all job which are posted by user -- admin
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req._id; //user id from token
    const jobs = await Job.find({ created_by: adminId }).populate({
      path:'company',
      createdAt:-1
    }); //populate company details
    if (!jobs) {
      return res.status(400).json({ message: "No jobs found", success: false });
    }

    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.log(error);
  }
};
