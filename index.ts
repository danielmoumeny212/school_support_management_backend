import { verifyToken } from './middlewares/verifyToken';
import { HTTPOK } from './status/status_code';
import path from 'path';
import dotenv from 'dotenv'; 
import morgan from 'morgan';
import cors from "cors"; 
import express from 'express';
import mongoose from "mongoose";
import AuthRoutes from "./routes/auth";
import UserRoutes from "./routes/user";
import StudentRoutes from "./routes/students";
import ClassRoutes from "./routes/classes";
import TeacherRoutes from "./routes/teachers"; 
import upload from './routes/common';


const app = express();

dotenv.config()

// middleware configuration from other modules 
app.use(cors());
app.use(express.json({limit: '50mb' }));
app.use(morgan('common'))
app.use("/uploads", express.static(path.join(__dirname,"/uploads")))

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URL as string)
.then(() => console.log("db connection established"))
.catch((err) => console.log(err.message)); 


app.use("/auth",AuthRoutes);
app.use("/auth/users", UserRoutes);
app.use("/students", StudentRoutes);
app.use("/classes", ClassRoutes);
app.use("/teachers", TeacherRoutes)

app.post('/upload', verifyToken,upload.single('file'),(req, res) => {
  res.status(HTTPOK).json("File has been uploaded successfully")
})

app.listen(process.env.PORT, ()=> {
  console.log("App is listening on port " + process.env.PORT);
})
