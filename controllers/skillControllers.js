import { check, validationResult } from 'express-validator';
import Skill from '../models/Skill.js';

const registrarSkill = async (req, res) => {
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
                const skill = new Skill(req.body);
                const skillAlmacenado = { msg: "Registro Guardado con exito." }
                await skill.sequelize.query(`call spSkillInsert('${skill.descripcion}','${usuariosid}');`,
                    { type: skill.sequelize.QueryTypes.INSERT }
                );
                res.json(skillAlmacenado);
            } catch (error) {
                console.log(error);
                res.json({ msg: "Error al guardar." });
            }
        }
    }
};
const actualizarSkill = async (req, res) => {
    const { id } = req.params;
    const { gestor } = req;
    try {
        const existeSkill = await Skill.sequelize.query(`call spSkillSelect2('${id}');`,
            { type: Skill.sequelize.QueryTypes.SELECT }
        );
        const elemento = existeSkill[0];
        const { permisosid, usuariosid } = gestor;
        if (!Object.keys(elemento).length) {
            const error = new Error("El Skill no existe");
            return res.status(404).json({ msg: error.message });
        }
        else {
            if (permisosid != 0) {
                const error = new Error("Sin Permiso de Administrador para la funcion!");
                return res.status(401).json({ msg: error.message });
            } else {
                elemento[0].Descripcion = req.body.descripcion.trim() || elemento[0].Descripcion;
                elemento[0].Estado = req.body.estado.trim() || elemento[0].Estado;
                elemento[0].UsuariosID = usuariosid || elemento[0].UsuariosID;
                try {
                    const skillAlmacenado = { msg: "Registro Skill Actualizado con exito." }
                    await Skill.sequelize.query(`call spSkillUpdate(${id},'${elemento[0].Descripcion}','${elemento[0].Estado}','${usuariosid}');`,
                        { type: Skill.sequelize.QueryTypes.UPDATE }
                    );
                    res.json(skillAlmacenado);
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
const bloqueoSkill = async (req, res) => {
    const { id } = req.params;
    const { gestor } = req;
    try {
        const existeSkill = await Skill.sequelize.query(`call spSkillSelect2('${id}');`,
            { type: Skill.sequelize.QueryTypes.SELECT }
        );
        const elemento = existeSkill[0];
        const { permisosid, usuariosid } = gestor;
        if (!Object.keys(elemento).length) {
            const error = new Error("El Skill no existe");
            return res.status(404).json({ msg: error.message });
        }
        else {
            if (permisosid != 0) {
                const error = new Error("Sin Permiso de Administrador para la funcion!");
                return res.status(401).json({ msg: error.message });
            } else {
                elemento[0].Est = "B";
                try {
                    const skillAlmacenado = { msg: "Registro Skill Bloqueado con exito." }
                    await Skill.sequelize.query(`call spSkillUpdateEstado(${id},'${usuariosid}','${elemento[0].Est}');`,
                        { type: Skill.sequelize.QueryTypes.UPDATE }
                    );
                    res.json(skillAlmacenado);
                } catch (error) {
                    console.log(error);
                    res.json({ msg: "Error al Bloquear Skill." });
                }
            }
        }
    } catch (error) {
        console.log(error);
        res.json({ msg: "Error en la Busqueda." });
    }
}
const obtenerSkill = async (req, res) => {
    const { id } = req.params;
    const { gestor } = req;
    try {
        const existeSkill = await Skill.sequelize.query(`call spSkillSelect2('${id}');`,
            { type: Skill.sequelize.QueryTypes.SELECT }
        );
        const elemento = existeSkill[0];
        const { permisosid } = gestor;
        if (!Object.keys(elemento).length) {
            const error = new Error("El Skill no existe");
            return res.status(404).json({ msg: error.message });
        }
        else {
            if (permisosid != 0) {
                const error = new Error("Sin Permiso de Administrador para la funcion!");
                return res.status(401).json({ msg: error.message });
            } else {
                res.json({
                    skillid: id,
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
const obtenerSkills = async (req, res) => {
    const { gestor } = req;
    const { permisosid } = gestor;
    if (permisosid != 0) {
        const error = new Error("Sin Permiso de Administrador para la funcion!");
        return res.status(401).json({ msg: error.message });
    } else {
        try {
            const skills = await Skill.sequelize.query('select * from spSkillSelect1;',
                { type: Skill.sequelize.QueryTypes.SELECT }
            );
            res.json(skills);
        } catch (error) {
            console.log(error);
            res.json({ msg: "Error en la Busqueda." });
        }
    }
}
const listarSkillsActivos = async (req, res) => {
    try {
        const skills = await Skill.sequelize.query('select * from spSkillSelect0;',
            { type: Skill.sequelize.QueryTypes.SELECT }
        );
        res.json(skills);
    } catch (error) {
        console.log(error);
        res.json({ msg: "Error en la Busqueda." });
    }
}
export { listarSkillsActivos, obtenerSkills, obtenerSkill, registrarSkill, actualizarSkill, bloqueoSkill };

