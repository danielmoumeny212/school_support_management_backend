import  { Router, Request, Response  } from "express"; 

import { HTTPFORBIDDEN, HTTPBADREQUEST, HTTPNOTFOUND, HTTPOK, HTTPUNAUTHORIZED, HTTPCREATED, HTTPACCEPTED, HTTPSERVERINTERNAL } from './../status/status_code';
import { verifyToken, verifyTokenAndAuthorization} from "../middlewares/verifyToken";
import Teachers from "../models/Teachers";
import User from "../models/Users";

const router = Router();


router.get('/me', verifyToken, async (req: any , res) => {
    const teacherId  = req.user.profilId;
    const user  = await User.findById(req.user.id);
    if(user?.role == "student" || user?.role == "admin") return res.status(HTTPUNAUTHORIZED).json({message: "Access denied"})
    const currentTeacher = await Teachers.findOne({userId: req.user.id}); 
    res.status(HTTPOK).json(currentTeacher);
})


export default router; 

