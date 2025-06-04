import express from 'express';
import  isAuthenticated  from '../middlewares/isAuthenticated.js';
import { postJob,getAdminJobs,getJobById,getAllJobs } from '../controller/job.controller.js';

const router = express.Router();

router.route("/post").post(isAuthenticated,postJob);
router.route("/get").get(isAuthenticated,getAllJobs); // get all jobs
router.route("/get/:id").get(isAuthenticated,getJobById); // get job by id  
router.route("/getAdminJobs").get(isAuthenticated,getAdminJobs); // get all jobs by admin id

export default router;