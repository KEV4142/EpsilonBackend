import { check, validationResult } from 'express-validator';
import Servicio from '../models/Servicio.js';
const bloqueoServicio = async (req, res) => {
    const { id } = req.params;
    const { gestor } = req;
    try {
        const existeServicio = await Servicio.sequelize.query(`call spServicioSelect2('${id}');`,
            { type: Servicio.sequelize.QueryTypes.SELECT }
        );
        const elemento = existeServicio[0];
        const { permisosid, usuariosid } = gestor;
        if (permisosid != 0) {
            const error = new Error("Sin Permiso de Administrador para la funcion!");
            return res.status(401).json({ msg: error.message });
        } else {
            if (!Object.keys(elemento).length) {
                const error = new Error("El Servicio no existe");
                return res.status(404).json({ msg: error.message });
            }
            else {

                elemento[0].Est = "I";
                try {
                    const servicioAlmacenado = { msg: "Registro Servicio Bloqueado con exito." }
                    await Servicio.sequelize.query(`call spServicioUpdateEstado(${id},'${usuariosid}','${elemento[0].Est}');`,
                        { type: Servicio.sequelize.QueryTypes.UPDATE }
                    );
                    res.json(servicioAlmacenado);
                } catch (error) {
                    console.log(error);
                    res.json({ msg: "Error al Bloquear Servicio." });
                }
            }
        }
    } catch (error) {
        console.log(error);
        res.json({ msg: "Error en la Busqueda." });
    }
}
const actualizarServicio = async (req, res) => {
    const { id } = req.params;
    const { gestor } = req;
    try {
        const existeServicio = await Servicio.sequelize.query(`call spServicioSelect2('${id}');`,
            { type: Servicio.sequelize.QueryTypes.SELECT }
        );
        const elemento = existeServicio[0];
        const { permisosid, usuariosid } = gestor;
        if (permisosid != 0) {
            const error = new Error("Sin Permiso de Administrador para la funcion!");
            return res.status(401).json({ msg: error.message });
        }
        else {
            if (!Object.keys(elemento).length) {
                const error = new Error("El Servicio no existe");
                return res.status(404).json({ msg: error.message });
            }
            else {
                elemento[0].Descripcion = req.body.descripcion.trim() || elemento[0].Descripcion;
                elemento[0].Estado = req.body.estado.trim() || elemento[0].Estado;
                elemento[0].UsuariosID = usuariosid || elemento[0].UsuariosID;
                try {
                    const servicioAlmacenado = { msg: "Registro Servicio Actualizado con exito." }
                    await Servicio.sequelize.query(`call spServicioUpdate(${id},'${elemento[0].Descripcion}','${elemento[0].Estado}','${usuariosid}');`,
                        { type: Servicio.sequelize.QueryTypes.UPDATE }
                    );
                    res.json(servicioAlmacenado);
                } catch (error) {
                    console.log(error);
                    res.json({ msg: "Error al Actualizar." });
                }
            }
        }
    } catch (error) {
        console.log(error);
        res.json({ msg: "Error en la Busqueda." });
    }
}
const registrarServicio = async (req, res) => {
    const { gestor } = req;
    const { permisosid, usuariosid } = gestor;
    let resultado = "";
    if (permisosid != 0) {
        const error = new Error("Sin Permiso de Administrador para la funcion!");
        return res.status(401).json({ msg: error.message });
    } else {
        await check('descripcion').notEmpty().withMessage('El campo Descripcion no puede estar vacio.').run(req);
        resultado = validationResult(req);
        if (resultado.array().length > 0) {
            return res.status(400).json({ msg: "El campo Descripcion no puede estar vacio." });
        }
        else {
            try {
                const servicio = new Servicio(req.body);
                const servisioAlmacenado = { msg: "Registro Guardado con exito." }
                await servicio.sequelize.query(`call spServicioInsert('${servicio.descripcion}','${usuariosid}');`,
                    { type: servicio.sequelize.QueryTypes.INSERT }
                );
                res.json(servisioAlmacenado);
            } catch (error) {
                console.log(error);
                res.json({ msg: "Error al guardar." });
            }
        }
    }
}
const obtenerServicio = async (req, res) => {
    const { id } = req.params;
    const { gestor } = req;
    try {
        const existeServicio = await Servicio.sequelize.query(`call spServicioSelect2('${id}');`,
            { type: Servicio.sequelize.QueryTypes.SELECT }
        );
        const elemento = existeServicio[0];
        const { permisosid } = gestor;
        if (permisosid != 0) {
            const error = new Error("Sin Permiso de Administrador para la funcion!");
            return res.status(401).json({ msg: error.message });
        } else {
            if (!Object.keys(elemento).length) {
                const error = new Error("El Servicio no existe");
                return res.status(404).json({ msg: error.message });
            }
            else {

                res.json({
                    servicioid: id,
                    descripcion: elemento[0].Descripcion,
                    estado: elemento[0].Estado,
                    est: elemento[0].Est
                });
            }
        }
    } catch (error) {
        console.log(error);
        res.json({ msg: "Error en la Busqueda." });
    }
}
const obtenerServicios = async (req, res) => {
    const { gestor } = req;
    const { permisosid } = gestor;
    if (permisosid != 0) {
        const error = new Error("Sin Permiso de Administrador para la funcion!");
        return res.status(401).json({ msg: error.message });
    } else {
        try {
            const servicio = await Servicio.sequelize.query('select * from spServicioSelect1;',
                { type: Servicio.sequelize.QueryTypes.SELECT }
            );
            res.json(servicio);
        } catch (error) {
            console.log(error);
            res.json({ msg: "Error en la Busqueda." });
        }
    }
}
const listarServiciosActivos = async (req, res) => {
    try {
        const servicio = await Servicio.sequelize.query('select * from spServicioSelect0;',
            { type: Servicio.sequelize.QueryTypes.SELECT }
        );
        res.json(servicio);
    } catch (error) {
        console.log(error);
        res.json({ msg: "Error en la Busqueda." });
    }
}

export { listarServiciosActivos, obtenerServicios, obtenerServicio, registrarServicio, actualizarServicio, bloqueoServicio };