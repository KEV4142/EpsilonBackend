import express from 'express'; 
import checkAuth from '../middleware/checkAuth.js';
import {obtenerGestores,registrarGestores,actualizarGestor,obtenerGestor,bloqueoGestor,autenticar,perfil,actualizarClave} from '../controllers/gestorControllers.js';

const router=express.Router();
router.post("/login",autenticar);
router.get("/perfil",checkAuth,perfil);
router.post("/",checkAuth,registrarGestores);
router.get("/listado",checkAuth,obtenerGestores);
router
    .route("/:id")
    .get(checkAuth,obtenerGestor)
    .put(checkAuth,actualizarGestor)
    .post(checkAuth,bloqueoGestor);

router.put("/clave/:id",checkAuth,actualizarClave);


export default router;