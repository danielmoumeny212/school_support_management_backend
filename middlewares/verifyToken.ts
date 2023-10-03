import jwt from "jsonwebtoken";
import { HTTPFORBIDDEN , HTTPUNAUTHORIZED} from "../status/status_code";

// export const verifyToken = (req:any , res:any , next:any)  => {
//     if (!req.headers.authorization) return res.status(HTTPFORBIDDEN).json("UNAUTHORIZED");
//     const token =  req.headers.authorization.split(" ")[1];
//     if (token) {
//        jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
//         if(err) res.status(HTTPFORBIDDEN).json({error: "invalid_token"}); 
//          req.user = user; 
//          next();
//        })
//     } else {
//       return res.status(HTTPUNAUTHORIZED).json({error: "You're not authenticated"});
//     }
// }
export const verifyToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(HTTPUNAUTHORIZED).json({ error: "You're not authenticated" });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(HTTPUNAUTHORIZED).json({ error: "You're not authenticated" });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(HTTPUNAUTHORIZED).json({ error: 'Token expired' });
      } else {
        return res.status(HTTPFORBIDDEN).json({ error: 'Invalid token' });
      }
    }

    req.user = decoded;
    next();
  });
};


export const verifyTokenAndAuthorization = (req:any, res:any, next:any) => {
    verifyToken(req, res, () => {
       if (req.user.role==="admin") {
         next();
       }else {
           res.status(HTTPFORBIDDEN).json("You are not allowed")
       }
    })
}