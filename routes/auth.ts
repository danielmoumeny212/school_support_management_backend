// import { verifyTokenAndAuthorization } from './../middlewares/verifyToken';
import  { Router, Request, Response  } from "express"; 
import Students from "../models/Students";
import  jwt from "jsonwebtoken"; 
import Joi from "joi";
import bcrypt from "bcrypt";
import User from '../models/Users'; 
import status_code from "../status/status_code";
import Teachers from "../models/Teachers";

const router = Router();


router.post('/register' ,async (req: Request , res: Response) => {
     const salt =  await bcrypt.genSalt(10);
     const {error} = validateSignUp(req.body); 
     if (error) return res.status(400).json(error.details[0].message); 

     const newUser = new User({
        username: req.body.username, 
        email: req.body.email, 
        role: req.body.role,
        name: req.body.name, 
        first_name: req.body.first_name,
        password:  await bcrypt.hash(req.body.password, salt)
     });
     try {
        const savedUser : any = await newUser.save();
        const {password, ...otherFields} = savedUser._doc;
        res.status(201).send(otherFields); 
     } catch(err: any){
          res.status(status_code.HTTPFORBIDDEN).json(err.message); 
          console.log(err);
     }

});

router.post("/jwt/create", async (req: Request, res:Response)=> {
    const {error} = validateLoginFields(req.body); 
    const { email , password } = req.body; 
    if (error) return res.status(status_code.HTTPBADREQUEST).json(error.details[0].message); 

    const user = await User.findOne({email: email});
    if (!user) return res.status(status_code.HTTPBADREQUEST).json({message: "Not Found user with the given credentials."});
    
    const profil = user?.role == 'student'? 
            await Students.findOne({userId: user?._id}) : 
            await Teachers.findOne({userId: user?._id})

     
    const isValidPwd = await bcrypt.compare(password, user?.password); 
    if(!isValidPwd) return res.status(status_code.HTTPBADREQUEST).json({message: "email or password incorrect."});

    const accessToken: string = jwt.sign({
      id: user._id, 
      profilId:  profil?._id, 
      role: user.role}, 
      process.env.JWT_SECRET as string, 
      {expiresIn: '1d'}
      );
    return res.status(status_code.HTTPOK).json({accessToken, userType: user.role}); 

})


const validateSignUp = (req:Request) =>{
  const schema = Joi.object({
     username: Joi.string().min(4).required(),
     email: Joi.string().min(8).max(255).email().required(),
     password: Joi.string().min(8).max(255).required(),
     name : Joi.string(), 
     first_name: Joi.string(),
     role: Joi.string().allow('admin', 'student', 'teacher').required(),

  })

  return schema.validate(req); 
}

const validateLoginFields = (req:Request) => {
  const schema  = Joi.object({
     email : Joi.string().min(8).max(255).required(),
     password: Joi.string().min(8).max(255).required(),
  })

  return schema.validate(req); 
}










export default router; 