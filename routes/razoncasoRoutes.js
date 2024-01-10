import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
import { listarRazonCasoActivos, obtenerRazonCaso, obtenerRazonCasos, registrarRazonCaso, actualizarRazonCaso, bloqueoRazonCaso } from '../controllers/razoncasoControllers.js';

const router = express.Router();

router.post("/", checkAuth, registrarRazonCaso);

router.get("/listado", checkAuth, obtenerRazonCasos);
router.get("/activos/:id", checkAuth, listarRazonCasoActivos);
router
    .route("/:id")
    .get(checkAuth, obtenerRazonCaso)
    .put(checkAuth, actualizarRazonCaso)
    .post(checkAuth, bloqueoRazonCaso);
export default router;