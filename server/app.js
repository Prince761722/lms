import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import express from 'express';
import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js'



import errorMiddleware from './middlewares/errorMiddleware.js';

const app=express();
app.use(express.json());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:true}));




app.use('/ping',(req,res)=>{
    res.send('pong');
})

// Routes of 3 modules

app.use('/api/v1/user',userRoutes);
app.use('/api/v1/courses',courseRoutes)

// 404 Error Handler
app.use((req, res, next) => {
  const error = new Error("Route Not Found");
  error.statusCode = 404;
  next(error);
});


app.use(errorMiddleware);


export default app;
