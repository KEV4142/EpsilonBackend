import { check, validationResult } from 'express-validator';
import MotivoRet from '../models/MotivoRet.js';
import Skill from '../models/Skill.js';
const registrarMotivoRet = async (req, res) =>{
    const { gestor } = req;
    const { permisosid, usuariosid } = gestor;
    let resultado = "";
    if (permisosid != 0) {
        const error = new Error("Sin Permiso de Administrador para la funcion!");
        return res.status(401).json({ msg: error.message });
    } else {
        const motivoRet = new MotivoRet(req.body);
        await check('descripcion').notEmpty().withMessage('El campo Descripcion no puede estar vacio.').run(req);
        resultado = validationResult(req);
        let elementoSkill
        try {
            if (motivoRet.skillid.trim().length > 0) {
                const existeSkill = await Skill.sequelize.query(`call spSkillSelect3('${motivoRet.skillid}');`,
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
        else if (motivoRet.estado.trim() != "A" && motivoRet.estado.trim() != "I") {
            const error = new Error("Campo Estado tiene que ser A o I!");
            return res.status(401).json({ msg: error.message });
        }
        else if (!Object.keys(elementoSkill).length) {
            const error1 = new Error("El Skill no existe o esta bloqueado.");
            return res.status(404).json({ msg: error1.message });
        }
        else {
            try {
                const motivoRetAlmacenado = { msg: "Registro Guardado con exito." }
                await motivoRet.sequelize.query(`call spMotivoRetIDInsert('${motivoRet.descripcion}','${motivoRet.skillid}','${usuariosid}');`,
                    { type: motivoRet.sequelize.QueryTypes.INSERT }
                );
                res.json(motivoRetAlmacenado);
            } catch (error) {
                console.log(error);
                res.json({ msg: "Error al guardar." });
            }
        }
    }
}
const actualizarMotivoRet = async (req, res) =>{
    const { id } = req.params;
    const { gestor } = req;
    try {
        const existeMotivoRet = await MotivoRet.sequelize.query(`call spMotivoRetSelect2('${id}');`,
            { type: MotivoRet.sequelize.QueryTypes.SELECT }
        );
        const elemento = existeMotivoRet[0];
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
                const error = new Error("La Motivo Retencion no existe");
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
                    const motivoRetAlmacenado = { msg: "Registro Motivo Retencion Actualizado con exito." }
                    await MotivoRet.sequelize.query(`call spMotivoRetUpdate(${id},'${elemento[0].Descripcion}','${elemento[0].Estado}','${elemento[0].SkillID}','${usuariosid}');`,
                        { type: MotivoRet.sequelize.QueryTypes.UPDATE }
                    );
                    res.json(motivoRetAlmacenado);
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
const bloqueoMotivoRet = async (req, res) =>{
    const { id } = req.params;
    const { gestor } = req;
    try {
        const existeMotivoRet = await MotivoRet.sequelize.query(`call spMotivoRetSelect2('${id}');`,
            { type: MotivoRet.sequelize.QueryTypes.SELECT }
        );
        const elemento = existeMotivoRet[0];
        const { permisosid, usuariosid } = gestor;
        if (permisosid != 0) {
            const error = new Error("Sin Permiso de Administrador para la funcion!");
            return res.status(401).json({ msg: error.message });
        } else {
            if (!Object.keys(elemento).length) {
                const error = new Error("El Motivo Retencion no existe");
                return res.status(404).json({ msg: error.message });
            }
            else {

                elemento[0].Est = "I";
                try {
                    const motivoRetAlmacenado = { msg: "Registro Motivo Retentencion Bloqueado con exito." }
                    await MotivoRet.sequelize.query(`call spMotivoRetUpdateEstado(${id},'${usuariosid}','${elemento[0].Est}');`,
                        { type: MotivoRet.sequelize.QueryTypes.UPDATE }
                    );
                    res.json(motivoRetAlmacenado);
                } catch (error) {
                    console.log(error);
                    res.json({ msg: "Error al Bloquear Motivo Retencion." });
                }
            }
        }
    } catch (error) {
        console.log(error);
        res.json({ msg: "Error en la Busqueda." });
    }
}
const obtenerMotivoRet = async (req, res) =>{
    const { id } = req.params;
    const { gestor } = req;
    try {
        const existeMotivoRet = await MotivoRet.sequelize.query(`call spMotivoRetSelect2('${id}');`,
            { type: MotivoRet.sequelize.QueryTypes.SELECT }
        );
        const elemento = existeMotivoRet[0];
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
                    motivoretid: id,
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
const obtenerMotivosRet = async (req, res) =>{
    const { gestor } = req;
    const { permisosid } = gestor;
    if (permisosid != 0) {
        const error = new Error("Sin Permiso de Administrador para la funcion!");
        return res.status(401).json({ msg: error.message });
    } else {
        try {
            const motivoRet = await MotivoRet.sequelize.query('select * from spMotivoRetSelect1;',
                { type: MotivoRet.sequelize.QueryTypes.SELECT }
            );
            res.json(motivoRet);
        } catch (error) {
            console.log(error);
            res.json({ msg: "Error en la Busqueda." });
        }
    }
}
const listarMotivoRetActivos = async (req, res) =>{
    const { id } = req.params;
    try {
        const motivoRet = await MotivoRet.sequelize.query(`select MotivoRetID,Descripcion from spMotivoRetSelect0 where Parametro=${id};`,
            { type: MotivoRet.sequelize.QueryTypes.SELECT }
        );
        res.json(motivoRet);
    } catch (error) {
        console.log(error);
        res.json({ msg: "Error en la Busqueda de Listado." });
    }
}
export { listarMotivoRetActivos, obtenerMotivoRet, obtenerMotivosRet, registrarMotivoRet, actualizarMotivoRet, bloqueoMotivoRet };