import dotenv from "dotenv";
dotenv.config();
import express, { Application } from "express";
import cors from 'cors';
import helmet from 'helmet';

const app: Application = express();

// middleware
app.use(express.json({limit:'5mb'}));
app.use(express.urlencoded({extended:true}));
app.use(cors({origin:"*"}));
app.use(helmet());

// routes
app.get('/',(req,res,next)=>{
  res.send("Welcome To CricHeroes Assignment");
});

// Server
const PORT = process?.env?.PORT ?? 5000;
app.listen(PORT,()=>{
  console.log(`Your Servier Is Running On ${PORT}`);
});