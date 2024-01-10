import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
import { listarResolucionCasoActivos, obtenerResolucionCaso, obtenerResolucionCasos, registrarResolucionCaso, actualizarResolucionCaso, bloqueoResolucionCaso } from '../controllers/resolucioncasoControllers.js';

const router = express.Router();

router.post("/", checkAuth, registrarResolucionCaso);

router.get("/listado", checkAuth, obtenerResolucionCasos);
router.get("/activos/:id", checkAuth, listarResolucionCasoActivos);
router
    .route("/:id")
    .get(checkAuth, obtenerResolucionCaso)
    .put(checkAuth, actualizarResolucionCaso)
    .post(checkAuth, bloqueoResolucionCaso);
export default router;