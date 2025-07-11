  import express from 'express';
  import cookieParser from 'cookie-parser';
  import cors from 'cors';
  import dotenv from 'dotenv';
  import connectDb from './utils/db.js';
  import userRoute from './routes/user.route.js';
  import companyRoute from './routes/company.route.js';
  import jobRoute from './routes/job.route.js';
  import applicationRoute from './routes/application.route.js';

  dotenv.config();

  const app = express();
  const port = process.env.PORT || 3000;

  app.get('/', (req, res) => {
    res.status(200).send('✅ Job Portal Backend is Running...');
  });

  // Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Allowed Origins
  // const allowedOrigins = [
  //   'http://localhost:5173',
  //   'https://job-portal-frontend-six-lime.vercel.app'
  // ];

  // // CORS Middleware (Handles Credentials)
  // app.use(cors({
  //   origin: function (origin, callback) {
  //     if (!origin || allowedOrigins.includes(origin)) {
  //       callback(null, origin);
  //     } else {
  //       console.warn('❌ Blocked by CORS:', origin);
  //       callback(new Error('Not allowed by CORS'));
  //     }
  //   },
  //   credentials: true,
  //   exposedHeaders: ['set-cookie'],
  //   methods: ['GET', 'POST', 'PUT', 'DELETE'],
  // }));



const allowedOrigins = [
  'http://localhost:5173',
  'https://job-portal-frontend-six-lime.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      console.warn('❌ Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
}));



  // API Routes
  app.use('/api/v1/user', userRoute);
  app.use('/api/v1/company', companyRoute);
  app.use('/api/v1/job', jobRoute);
  app.use('/api/v1/application', applicationRoute);

  // Start server only after MongoDB is connected
  connectDb()
    .then(() => {
      app.listen(port, () => {
        console.log(`🚀 Server is running on port ${port}`);
      });
    })
    .catch((err) => {
      console.error('❌ MongoDB connection failed:', err);
    });