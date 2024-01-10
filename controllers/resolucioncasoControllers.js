import { check, validationResult } from 'express-validator';
import ResolucionCaso from '../models/ResolucionCaso.js';
import Skill from '../models/Skill.js';
const registrarResolucionCaso = async (req, res) => {
    const { gestor } = req;
    const { permisosid, usuariosid } = gestor;
    let resultado = "";
    if (permisosid != 0) {
        const error = new Error("Sin Permiso de Administrador para la funcion!");
        return res.status(401).json({ msg: error.message });
    } else {
        const resolucionCaso = new ResolucionCaso(req.body);
        await check('descripcion').notEmpty().withMessage('El campo Descripcion no puede estar vacio.').run(req);
        resultado = validationResult(req);
        let elementoSkill
        try {
            if (resolucionCaso.skillid.trim().length > 0) {
                const existeSkill = await Skill.sequelize.query(`call spSkillSelect3('${resolucionCaso.skillid}');`,
                    { type: Skill.sequelize.QueryTypes.SELECT }
                );
                elementoSkill = existeSkill[0];
            }
            else {
                const erro = new Error("Campo SkillID no tiene que estar vacio!");
                return res.status(401).json({ msg: erro.message });
            }
        } catch (error) {
            console.log(error);
            res.json({ msg: "Error al buscar Skill." });
        }

        if (resultado.array().length > 0) {
            return res.status(400).json({ msg: "El campo Descripcion no puede estar vacio." });
        }
        else if (resolucionCaso.estado.trim() != "A" && resolucionCaso.estado.trim() != "I") {
            const error = new Error("Campo Estado tiene que ser A o I!");
            return res.status(401).json({ msg: error.message });
        }
        else if (!Object.keys(elementoSkill).length) {
            const error1 = new Error("El Skill no existe o esta bloqueado.");
            return res.status(404).json({ msg: error1.message });
        }
        else {
            try {
                const resolucionCasoAlmacenado = { msg: "Registro Guardado con exito." }
                await resolucionCaso.sequelize.query(`call spResolucionCasoInsert('${resolucionCaso.descripcion}','${resolucionCaso.skillid}','${usuariosid}');`,
                    { type: resolucionCaso.sequelize.QueryTypes.INSERT }
                );
                res.json(resolucionCasoAlmacenado);
            } catch (error) {
                console.log(error);
                res.json({ msg: "Error al guardar." });
            }
        }
    }
}
const actualizarResolucionCaso = async (req, res) => {
    const { id } = req.params;
    const { gestor } = req;
    try {
        const existeResolucionCaso = await ResolucionCaso.sequelize.query(`call spResolucionCasoSelect2('${id}');`,
            { type: ResolucionCaso.sequelize.QueryTypes.SELECT }
        );
        const elemento = existeResolucionCaso[0];
        const { permisosid, usuariosid } = gestor;
        if (permisosid != 0) {
            const error = new Error("Sin Permiso de Administrador para la funcion!");
            return res.status(401).json({ msg: error.message });
        }
        else {
            let elementoSkill
            try {
                if (req.body.skillid.trim().length > 0) {
                    const existeSkill = await Skill.sequelize.query(`call spSkillSelect3('${req.body.skillid}');`,
                        { type: Skill.sequelize.QueryTypes.SELECT }
                    );
                    elementoSkill = existeSkill[0];
                }
                else {
                    const erro = new Error("Campo SkillID no tiene que estar vacio!");
                    return res.status(401).json({ msg: erro.message });
                }
            } catch (error) {
                console.log(error);
                res.json({ msg: "Error al buscar Skill." });
            }
            if (!Object.keys(elemento).length) {
                const error = new Error("El Resolucion Caso no existe");
                return res.status(404).json({ msg: error.message });
            }
            else if (req.body.estado.trim() != "A" && req.body.estado.trim() != "I") {
                const error = new Error("Campo Estado tiene que ser A o I!");
                return res.status(401).json({ msg: error.message });
            }
            else if (!Object.keys(elementoSkill).length) {
                const error1 = new Error("El Skill no existe o esta bloqueado.");
                return res.status(404).json({ msg: error1.message });
            }
            else {
                elemento[0].Descripcion = req.body.descripcion.trim() || elemento[0].Descripcion;
                elemento[0].Estado = req.body.estado.trim() || elemento[0].Estado;
                elemento[0].SkillID = req.body.skillid.trim() || elemento[0].SkillID;
                elemento[0].UsuariosID = usuariosid || elemento[0].UsuariosID;
                try {
                    const resolucionCasoAlmacenado = { msg: "Registro Resolucion Caso Actualizado con exito." }
                    await ResolucionCaso.sequelize.query(`call spResolucionCasoUpdate(${id},'${elemento[0].Descripcion}','${elemento[0].Estado}','${elemento[0].SkillID}','${usuariosid}');`,
                        { type: ResolucionCaso.sequelize.QueryTypes.UPDATE }
                    );
                    res.json(resolucionCasoAlmacenado);
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
const bloqueoResolucionCaso = async (req, res) => {
    const { id } = req.params;
    const { gestor } = req;
    try {
        const existeResolucionCaso = await ResolucionCaso.sequelize.query(`call spResolucionCasoSelect2('${id}');`,
            { type: ResolucionCaso.sequelize.QueryTypes.SELECT }
        );
        const elemento = existeResolucionCaso[0];
        const { permisosid, usuariosid } = gestor;
        if (permisosid != 0) {
            const error = new Error("Sin Permiso de Administrador para la funcion!");
            return res.status(401).json({ msg: error.message });
        } else {
            if (!Object.keys(elemento).length) {
                const error = new Error("El Resolucion Caso Caso no existe");
                return res.status(404).json({ msg: error.message });
            }
            else {

                elemento[0].Est = "I";
                try {
                    const resolucionCasoAlmacenado = { msg: "Registro Resolucion Caso Bloqueado con exito." }
                    await ResolucionCaso.sequelize.query(`call spResolucionCasoUpdateEstado(${id},'${usuariosid}','${elemento[0].Est}');`,
                        { type: ResolucionCaso.sequelize.QueryTypes.UPDATE }
                    );
                    res.json(resolucionCasoAlmacenado);
                } catch (error) {
                    console.log(error);
                    res.json({ msg: "Error al Bloquear Resolucion Caso." });
                }
            }
        }
    } catch (error) {
        console.log(error);
        res.json({ msg: "Error en la Busqueda." });
    }
}
const obtenerResolucionCaso = async (req, res) => {
    const { id } = req.params;
    const { gestor } = req;
    try {
        const existeResolucionCaso = await ResolucionCaso.sequelize.query(`call spResolucionCasoSelect2('${id}');`,
            { type: ResolucionCaso.sequelize.QueryTypes.SELECT }
        );
        const elemento = existeResolucionCaso[0];
        const { permisosid } = gestor;
        if (permisosid != 0) {
            const error = new Error("Sin Permiso de Administrador para la funcion!");
            return res.status(401).json({ msg: error.message });
        } else {
            if (!Object.keys(elemento).length) {
                const error = new Error("El Resolucion Caso no existe");
                return res.status(404).json({ msg: error.message });
            }
            else {

                res.json({
                    resolucioncasoid: id,
                    descripcion: elemento[0].Descripcion,
                    estado: elemento[0].Estado,
                    est: elemento[0].Est,
                    skillid: elemento[0].SkillID,
                    skill: elemento[0].Skill
                });
            }
        }
    } catch (error) {
        console.log(error);
        res.json({ msg: "Error en la Busqueda." });
    }
}
const obtenerResolucionCasos = async (req, res) => {
    const { gestor } = req;
    const { permisosid } = gestor;
    if (permisosid != 0) {
        const error = new Error("Sin Permiso de Administrador para la funcion!");
        return res.status(401).json({ msg: error.message });
    } else {
        try {
            const resolucionCaso = await ResolucionCaso.sequelize.query('select * from spResolucionCasoSelect1;',
                { type: ResolucionCaso.sequelize.QueryTypes.SELECT }
            );
            res.json(resolucionCaso);
        } catch (error) {
            console.log(error);
            res.json({ msg: "Error en la Busqueda." });
        }
    }
}

const listarResolucionCasoActivos = async (req, res) => {
    const { id } = req.params;
    try {
        const resolucionCaso = await ResolucionCaso.sequelize.query(`select ResolucionCasoID,Descripcion from spResolucionCasoSelect0 where Parametro=${id};`,
            { type: ResolucionCaso.sequelize.QueryTypes.SELECT }
        );
        res.json(resolucionCaso);
    } catch (error) {
        console.log(error);
        res.json({ msg: "Error en la Busqueda de Listado." });
    }
}



export { listarResolucionCasoActivos, obtenerResolucionCaso, obtenerResolucionCasos, registrarResolucionCaso, actualizarResolucionCaso, bloqueoResolucionCaso };