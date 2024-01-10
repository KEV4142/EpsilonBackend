import { check, validationResult } from 'express-validator';
import RazonCaso from '../models/RazonCaso.js';
import Skill from '../models/Skill.js';
const registrarRazonCaso = async (req, res) => {
    const { gestor } = req;
    const { permisosid, usuariosid } = gestor;
    let resultado = "";
    if (permisosid != 0) {
        const error = new Error("Sin Permiso de Administrador para la funcion!");
        return res.status(401).json({ msg: error.message });
    } else {
        const razonCaso = new RazonCaso(req.body);
        await check('descripcion').notEmpty().withMessage('El campo Descripcion no puede estar vacio.').run(req);
        resultado = validationResult(req);
        let elementoSkill
        try {
            if (razonCaso.skillid.trim().length > 0) {
                const existeSkill = await Skill.sequelize.query(`call spSkillSelect3('${razonCaso.skillid}');`,
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
        else if (razonCaso.estado.trim() != "A" && razonCaso.estado.trim() != "I") {
            const error = new Error("Campo Estado tiene que ser A o I!");
            return res.status(401).json({ msg: error.message });
        }
        else if (!Object.keys(elementoSkill).length) {
            const error1 = new Error("El Skill no existe o esta bloqueado.");
            return res.status(404).json({ msg: error1.message });
        }
        else {
            try {
                const razonCasoAlmacenado = { msg: "Registro Guardado con exito." }
                await razonCaso.sequelize.query(`call spRazonCasoInsert('${razonCaso.descripcion}','${razonCaso.skillid}','${usuariosid}');`,
                    { type: razonCaso.sequelize.QueryTypes.INSERT }
                );
                res.json(razonCasoAlmacenado);
            } catch (error) {
                console.log(error);
                res.json({ msg: "Error al guardar." });
            }
        }
    }
}
const actualizarRazonCaso = async (req, res) => {
    const { id } = req.params;
    const { gestor } = req;
    try {
        const existeRazonCaso = await RazonCaso.sequelize.query(`call spRazoncasoSelect2('${id}');`,
            { type: RazonCaso.sequelize.QueryTypes.SELECT }
        );
        const elemento = existeRazonCaso[0];
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
                const error = new Error("La Razon Caso no existe");
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
                    const razonCasoAlmacenado = { msg: "Registro Razon Caso Actualizado con exito." }
                    await RazonCaso.sequelize.query(`call spRazoncasoUpdate(${id},'${elemento[0].Descripcion}','${elemento[0].Estado}','${elemento[0].SkillID}','${usuariosid}');`,
                        { type: RazonCaso.sequelize.QueryTypes.UPDATE }
                    );
                    res.json(razonCasoAlmacenado);
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
const bloqueoRazonCaso = async (req, res) => {
    const { id } = req.params;
    const { gestor } = req;
    try {
        const existeRazonCaso = await RazonCaso.sequelize.query(`call spRazoncasoSelect2('${id}');`,
            { type: RazonCaso.sequelize.QueryTypes.SELECT }
        );
        const elemento = existeRazonCaso[0];
        const { permisosid, usuariosid } = gestor;
        if (permisosid != 0) {
            const error = new Error("Sin Permiso de Administrador para la funcion!");
            return res.status(401).json({ msg: error.message });
        } else {
            if (!Object.keys(elemento).length) {
                const error = new Error("El Razon Caso no existe");
                return res.status(404).json({ msg: error.message });
            }
            else {

                elemento[0].Est = "I";
                try {
                    const razonCasoAlmacenado = { msg: "Registro Razon Caso Bloqueado con exito." }
                    await RazonCaso.sequelize.query(`call spRazonUpdateEstado(${id},'${usuariosid}','${elemento[0].Est}');`,
                        { type: RazonCaso.sequelize.QueryTypes.UPDATE }
                    );
                    res.json(razonCasoAlmacenado);
                } catch (error) {
                    console.log(error);
                    res.json({ msg: "Error al Bloquear Razon Caso." });
                }
            }
        }
    } catch (error) {
        console.log(error);
        res.json({ msg: "Error en la Busqueda." });
    }
}
const obtenerRazonCaso = async (req, res) => {
    const { id } = req.params;
    const { gestor } = req;
    try {
        const existeRazonCaso = await RazonCaso.sequelize.query(`call spRazoncasoSelect2('${id}');`,
            { type: RazonCaso.sequelize.QueryTypes.SELECT }
        );
        const elemento = existeRazonCaso[0];
        const { permisosid } = gestor;
        if (permisosid != 0) {
            const error = new Error("Sin Permiso de Administrador para la funcion!");
            return res.status(401).json({ msg: error.message });
        } else {
            if (!Object.keys(elemento).length) {
                const error = new Error("El Razon Caso no existe");
                return res.status(404).json({ msg: error.message });
            }
            else {

                res.json({
                    razoncasoid: id,
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
const obtenerRazonCasos = async (req, res) => {
    const { gestor } = req;
    const { permisosid } = gestor;
    if (permisosid != 0) {
        const error = new Error("Sin Permiso de Administrador para la funcion!");
        return res.status(401).json({ msg: error.message });
    } else {
        try {
            const razonCaso = await RazonCaso.sequelize.query('select * from spRazoncasoSelect1;',
                { type: RazonCaso.sequelize.QueryTypes.SELECT }
            );
            res.json(razonCaso);
        } catch (error) {
            console.log(error);
            res.json({ msg: "Error en la Busqueda." });
        }
    }
}
const listarRazonCasoActivos = async (req, res) => {
    const { id } = req.params;
    try {
        const razonCaso = await RazonCaso.sequelize.query(`select RazonCasoID,Descripcion from spRazoncasoSelect0 where Parametro=${id};`,
            { type: RazonCaso.sequelize.QueryTypes.SELECT }
        );
        res.json(razonCaso);
    } catch (error) {
        console.log(error);
        res.json({ msg: "Error en la Busqueda de Listado." });
    }
}



export { listarRazonCasoActivos, obtenerRazonCaso, obtenerRazonCasos, registrarRazonCaso, actualizarRazonCaso, bloqueoRazonCaso };