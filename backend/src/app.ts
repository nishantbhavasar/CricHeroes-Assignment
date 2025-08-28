import 'module-alias/register';
import dotenv from "dotenv";
dotenv.config();
import express, { Application } from "express";
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan'
import { errroHandler } from "./middleware/globleErrorHandler";
import { routeNotFound } from "./middleware/404RouteHandler";
import nrrRouter from "./routes/nrr.routes";
const app: Application = express();

// middleware
app.use(express.json({limit:'5mb'}));
app.use(express.urlencoded({extended:true}));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({origin:"*"}));
app.use(morgan("dev"));

// routes
app.use('/api',nrrRouter);

// Handle 404 Route Not Found
app.use(routeNotFound);

// Globle Error Handler
app.use(errroHandler);

// Server
const PORT = process?.env?.PORT ?? 5000;
app.listen(PORT,()=>{
  console.log(`Your Servier Is Running On ${PORT}`);
});