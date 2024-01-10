import express from 'express'; 
import checkAuth from '../middleware/checkAuth.js';
import {registrarCasoC,registrarCasoP,actualizarCasoC,actualizarCasoP,actualizarCasoCR,actualizarCasoPR,obtenerCasoRetornado,obtenerCaso,obtenerCasosPendietes,obtenerReporte} from '../controllers/casoControllers.js'
const router=express.Router();

router.post("/nuevoc",checkAuth,registrarCasoC);
router.post("/nuevop",checkAuth,registrarCasoP);

router.put("/pendientec/:id",checkAuth,actualizarCasoC);
router.put("/pendientep/:id",checkAuth,actualizarCasoP);

router.put("/retornadoc/:id",checkAuth,actualizarCasoCR);
router.put("/retornadop/:id",checkAuth,actualizarCasoPR);

router.get("/listado",checkAuth,obtenerCasosPendietes);
router.get("/activo/:id",checkAuth,obtenerCaso);
router.get("/cerrado/:id",checkAuth,obtenerCasoRetornado);
router.post("/reporte",checkAuth,obtenerReporte);
    
export default router;