import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
import { listarServiciosActivos, obtenerServicios, obtenerServicio, registrarServicio, actualizarServicio, bloqueoServicio } from '../controllers/serviciooControllers.js';

const router = express.Router();

router.post("/", checkAuth, registrarServicio);

router.get("/listado", checkAuth, obtenerServicios);
router.get("/activos", checkAuth, listarServiciosActivos);
router
    .route("/:id")
    .get(checkAuth, obtenerServicio)
    .put(checkAuth, actualizarServicio)
    .post(checkAuth, bloqueoServicio);
export default router;