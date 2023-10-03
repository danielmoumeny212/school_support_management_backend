import  { Router, Request, Response  } from "express"; 
import User from '../models/Users'; 
import { verifyToken } from "../middlewares/verifyToken";
import { HTTPOK} from "../status/status_code";

const router = Router();

router.get('/me', verifyToken, async (req:any , res: Response) => {
      const user: any  = await User.findById(req.user.id);
      const {password, ...others} = user._doc; 

      res.status(HTTPOK).json(others);
})












export default router; 