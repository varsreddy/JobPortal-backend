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



import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    // Avoid re-connecting on every invocation
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "test", // specify DB name if needed
    });

    isConnected = db.connections[0].readyState === 1;
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err; // rethrow to let calling code handle it
  }
};

export default connectDB;
