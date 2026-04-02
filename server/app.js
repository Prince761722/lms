import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import express from 'express';
import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import miscRoutes from './routes/miscRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import errorMiddleware from './middlewares/errorMiddleware.js';
import multiCreatorRoutes from './routes/multiCreatorRoutes.js'

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



app.use('/api/v1/user',userRoutes);
app.use('/api/v1/courses',courseRoutes)
app.use('/api/v1/contact',miscRoutes)
app.use('/api/v1/payment',paymentRoutes)
app.use('/api/v1/creator',multiCreatorRoutes)




app.use((req, res, next) => {
  const error = new Error("Route Not Found");
  error.statusCode = 404;
  next(error);
});


app.use(errorMiddleware);


export default app;
