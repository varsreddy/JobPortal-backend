// import mongoose from "mongoose";

// const connectDB = async () => {
//     try{
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log('mongoDB connected successfully');
//     }catch(err){
//         console.log(err);
//     }
// }

// export default connectDB;



// db.js
import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
};

export default connectDB;

