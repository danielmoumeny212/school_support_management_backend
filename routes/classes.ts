import  { Router, Request, Response  } from "express"; 
import Joi from "joi"; 
import { HTTPFORBIDDEN, HTTPBADREQUEST, HTTPNOTFOUND, HTTPOK, HTTPUNAUTHORIZED, HTTPCREATED, HTTPACCEPTED, HTTPSERVERINTERNAL } from './../status/status_code';
import { verifyToken, verifyTokenAndAuthorization} from "../middlewares/verifyToken";
import Support from "../models/Support";
import Classes from "../models/Classes";
import Students from "../models/Students";
import Teachers from "../models/Teachers";
import Users from "../models/Users";
import Evaluation from "../models/Evaluation";




const router = Router();

router.get("/", verifyToken,async (req,res ) => {
  try {
    const classes = await Classes.find(); 
    res.status(HTTPOK).json(classes);

  } catch(err){
       res.status(HTTPSERVERINTERNAL).json(err);
  }
})

router.get("/:id", verifyToken, async(req, res) => {
    const { id } = req.params; 
    const { name } = req.query
    try{
      let classe = await Classes.findById(id)
      if(name) return res.status(HTTPOK).json({"id": classe?._id , "name" : classe?.name}); 

      res.status(HTTPOK).json(classe); 
    }catch(err){
        res.status(HTTPNOTFOUND).json({ error: "NOT FOUND"})
    }
})

router.get('/:id/exams', verifyToken, async(req, res) =>{
     const {id} = req.params; 
   try{
    const classe = await Classes.findById(id)
    if(!classe) return res.status(HTTPNOTFOUND).json("Not Found"); 
    const exams = await Promise.all(
      (classe.evaluations ?? []).map((evaluationId: string ) => Evaluation.findOne({_id:evaluationId}))
      )
      res.status(HTTPOK).json(exams); 
   }catch(err){
      res.status(HTTPNOTFOUND).json("Not Found ")
   }
})


router.get("/:id/supports", verifyToken, async (req, res) => {
  const {id } = req.params;
  try {
    const classe = await Classes.findById(id);
    if (!classe) {
      throw new Error(`La classe avec l'ID ${id} n'a pas été trouvée.`);
    }
    const supports : any = await Promise.all((classe.supports ?? []).map(async (supportId: string) => {
      const support : any = await Support.findById(supportId);
      return {
        ...support?.toObject(),
        className: classe.name
      };
    }));
    res.status(HTTPOK).json(supports);

  } catch(err: any ) {
    res.status(HTTPNOTFOUND).json("Not found")
  }
})


router.put("/:id/supports", verifyToken, async(req, res) =>{
    
  const  {error} = validateSupport(req.body);
  if (error) return res.status(HTTPBADREQUEST).json(error.details[0].message)

  try {
    const support = new Support(req.body);

    await support.save();

    const supportId = support._id;

    const classeId = req.params.id;
   await Classes.findByIdAndUpdate(classeId, {$push: { supports: supportId }},);
    const classe = await Classes.findById(classeId);

    res.status(200).json({...support.toObject(), className: classe?.name});

  } catch (error) {
    res.status(500).send({ error: error });
  }
});

router.get('/:id/students', verifyToken, async(req, res) =>{
  const {id} = req.params; 
    
  try {
    const classe = await Classes.findById(id)
    if (!classe) {
      // faire quelque chose si la classe n'est pas trouvée
      throw new Error(`La classe avec l'ID ${id} n'a pas été trouvée.`);
    }
    const students = await Promise.all(
      (classe.students ?? []).map((studentId: string) => {
         return Users.findOne({_id: studentId}).select('-password');
      })
      );
      res.status(HTTPOK).json(students);
  }catch(err){
    res.status(HTTPNOTFOUND).json("Not found ")
  }
})
router.get('/:id/teachers', verifyToken, async(req, res) => {
  const {id} = req.params; 
  try {
    const classe = await Classes.findById(id);
if (!classe) {
  // faire quelque chose si la classe n'est pas trouvée
  throw new Error(`La classe avec l'ID ${id} n'a pas été trouvée.`);
}

const teachers = await Promise.all(
  (classe.teachers ?? []).map(async (teacherId: string) => {
    const user = await Users.findOne({ _id: teacherId }).select('-password');
    return user;
  })
);
    res.status(HTTPOK).json(teachers); 
  }catch(err){
     res.status(HTTPNOTFOUND).json("Not found ")
  }
})

router.post('/create', verifyTokenAndAuthorization, async (req,res) => {
       const  {error} = validateClasse(req.body);
       if (error) return res.status(HTTPBADREQUEST).json(error.details[0].message);
       const newClasse = new Classes({
          name : req.body.name,
       })
       const result = await newClasse.save();
       res.status(HTTPCREATED).json(result);
});

router.post('/:id/:user_id/addExams', verifyToken, async(req, res) => {
  const {id , user_id } = req.params; 
  const classe = await Classes.findById(id);
  const currentUser = await Users.findById(user_id); 
  if(!currentUser) return res.status(HTTPNOTFOUND).json('Not Found')
  if (currentUser.role == "student") return res.status(HTTPUNAUTHORIZED).json("Unauthorized")
  if(!classe) return res.status(HTTPNOTFOUND).json("Not Found"); 
  // const {error}  = validateExam(req.body); 
  // if (error) return res.status(HTTPBADREQUEST).json(error.details[0].message);

  const evaluation = new Evaluation(req.body);
  const newEvaluation = await evaluation.save();
  if(!classe.evaluations.includes(newEvaluation._id)){
    await classe.updateOne({
      $push: {
        evaluations: newEvaluation._id
      }
    }); 

      res.status(HTTPOK).json(newEvaluation)
      return 
  }

  res.status(HTTPBADREQUEST).json("Bad Request")
  
})






router.put('/:id/add/:user_id', verifyTokenAndAuthorization, async(req, res) => {
     const { id, user_id } = req.params; 
     try {
       const classe = await Classes.findById(id);
       const classeId = classe?._id; 
       const user = await Users.findById(user_id)

       if(user?.role !=="student") return res.status(HTTPFORBIDDEN).json("You cannot perform this action");

       await Students.findOneAndUpdate({userId: user_id}, {classId: classeId})
      
       if(!classe?.students.includes(user?.id!))
       {
           await classe?.updateOne({
          $push: {
              students: user_id
            }
           })
           
           return res.status(HTTPACCEPTED).json("student successfully add ");
       } 
       
         res.status(HTTPFORBIDDEN).json("this student is already in this classes")
       
      


     } catch(err){
       res.status(HTTPNOTFOUND).json({ error: err});
     }

})
router.put('/:id/addTe/:user_id', verifyTokenAndAuthorization, async(req, res) => {
  const { id, user_id } = req.params; 
  try {
    const classe = await Classes.findById(id);
    const user = await Users.findById(user_id)
    const students= await Students.find({classId: id})
    const teacher = await Teachers.findOne({userId: user?.id})
    
    if(user?.role !=="teacher") return res.status(HTTPFORBIDDEN).json("You cannot perform this action");


   if(!teacher?.classes.includes(id)){
       await teacher?.updateOne({
        $push: {
          classes: id
        }
      })
   }

   
   
    if(!classe?.teachers.includes(user_id)) {
        await classe?.updateOne({
         $push: {
           teachers: user_id
         }
      })
    if(students){
      for(const student of students ){
         if (!student.teachers.includes(user_id)){
            await student.updateOne({$push: {
              teachers: user_id
            }})
         }
      }
    }
     
        return res.status(HTTPACCEPTED).json("teachers successfully add ");
    } 
    res.status(HTTPFORBIDDEN).json("teachers is already in this classes")

    


  } catch(err){
    res.status(HTTPNOTFOUND).json({ error: err});
  }

})





const validateClasse = (req:Request) => {
  const schema = Joi.object({
     name: Joi.string().required(),
  })
  return schema.validate(req)
}


const validateExam  = (req: Request) => {
  const schema = Joi.object({
     examType: Joi.string().allow('google form').insensitive(),
     formLink: Joi.string().max(255)
     .pattern(/^(?:https?:\/\/)?(?:docs|drive)\.google\.com\/forms\/d\/([a-zA-Z0-9_-]+)(?:\/.*)?$/)
     .required(),
     date: Joi.date().required(),
     classId: Joi.string()
  })
  return schema.validate(req); 
}


function validateSupport(support: Request ) {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    file: Joi.string().required().pattern(/\.(pdf|docx|doc|pptx|ppt)$/i),
    class: Joi.string().required(),
    teacher: Joi.string().required()
  });
  return schema.validate(support);
}



export default router; 


