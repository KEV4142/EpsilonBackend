import express from 'express'; 
import checkAuth from '../middleware/checkAuth.js';
import {listarSkillsActivos,obtenerSkills,obtenerSkill,registrarSkill,actualizarSkill,bloqueoSkill} from '../controllers/skillControllers.js'
const router=express.Router();

router.post("/",checkAuth,registrarSkill);
//router.post("/login",autenticar);

router.get("/listado",checkAuth,obtenerSkills);
router.get("/activos",checkAuth,listarSkillsActivos);
router
    .route("/:id")
    .get(checkAuth,obtenerSkill)
    .put(checkAuth,actualizarSkill)
    .post(checkAuth,bloqueoSkill);
export default router;