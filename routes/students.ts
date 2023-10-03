import { verifyTokenAndAuthorization } from './../middlewares/verifyToken';
import  { Router, Request, Response  } from "express"; 
import Joi from "joi";
import User from '../models/Users'; 
import Students from "../models/Students";
import {HTTPBADREQUEST, HTTPNOTFOUND, HTTPOK, HTTPUNAUTHORIZED } from './../status/status_code';
import { verifyToken } from "../middlewares/verifyToken";

const router = Router();


router.get('/me', verifyToken, async (req: any , res) => {
    const studentId = req.user.profilId;
    const user  = await User.findById(req.user.id);
    if(user?.role == "teacher" || user?.role == "admin") return res.status(HTTPUNAUTHORIZED).json({message: "Access denied"})
    const currentStudent = await Students.findOne({userId: req.user.id}); 
    res.status(HTTPOK).json(currentStudent);
})



router.put('/me', verifyToken, async (req:any , res: Response) => {
      const studentId = req.user.profilId; 
      const  {error} = validateUpdateStudent(req.body); 
      if (error)  return res.status(HTTPBADREQUEST).json(error.details[0].message);
      const user  = await User.findById(req.user.id);
      if(user?.role == "teacher" || user?.role == "admin") return res.status(HTTPUNAUTHORIZED).json({message: "Access denied"})
        try {
           const result = await Students.findByIdAndUpdate(studentId,req.body , {new : true});
           res.status(HTTPOK).json(result);

        }catch(err){
           return res.status(HTTPNOTFOUND).json(err)
        }      
});














const validateUpdateStudent = (req: Request) => {
   const schema = Joi.object({
    name: Joi.string().min(4),
    first_name:  Joi.string().min(4),
    picture: Joi.string(),
   })

   return schema.validate(req)
}











export default router; 