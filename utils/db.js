import mongoose from 'mongoose';

const connectDb = async () => {
  try {
    console.log("🔍 VERCEL MONGO_URI:", process.env.MONGO_URI);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error; // This is important to prevent the app from starting without DB
  }
};

export default connectDb;