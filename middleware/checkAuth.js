import jwt from "jsonwebtoken";
import Gestor from "../models/gestor.js";
const checkAuth = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.gestor = await Gestor.findOne({
                where: { usuariosid: decoded.id, estado: 'A' },
                attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'clave', 'skillid'] }
            });
            if (!req.gestor) {
                const error = new Error("El usuario sin permiso por bloqueo.");
                return res.status(404).json({ msg: error.message });
            }
            else {
                return next();
            }
        } catch (error) {
            return res.status(404).json({ msg: "Error en autenticar usuario..." });
        }
    }
    if (!token) {
        const error = new Error("CheckAuth: Chequeo: Token no valido");
        res.status(404).json({ msg: error.message });
    }

};
export default checkAuth;