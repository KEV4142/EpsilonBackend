import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
import { listarMotivoRetActivos, obtenerMotivoRet, obtenerMotivosRet, registrarMotivoRet, actualizarMotivoRet, bloqueoMotivoRet } from '../controllers/motivoretControllers.js';

const router = express.Router();

router.post("/", checkAuth, registrarMotivoRet);

router.get("/listado", checkAuth, obtenerMotivosRet);
router.get("/activos/:id", checkAuth, listarMotivoRetActivos);
router
    .route("/:id")
    .get(checkAuth, obtenerMotivoRet)
    .put(checkAuth, actualizarMotivoRet)
    .post(checkAuth, bloqueoMotivoRet);
export default router;