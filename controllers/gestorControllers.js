import { check, validationResult } from 'express-validator';
import Gestor from '../models/gestor.js';
import generarJWT from '../helpers/generarJWT.js';



const autenticar = async (req, res) => {
    const { username, clave } = req.body;
    const gestor = await Gestor.sequelize.query(`call spUsuariosLogin('${username}','${clave}');`,
        { type: Gestor.sequelize.QueryTypes.SELECT }
    );
    const elemento = gestor[0];
    if (!Object.keys(elemento).length) {
        const error = new Error("El usuario no existe o credenciales invalidas");
        return res.status(404).json({ msg: error.message });
    }
    else {
        res.json({
            _id: elemento[0].UsuariosID,
            nombres: elemento[0].Nombres,
            username: elemento[0].UserName,
            permisosid: elemento[0].PermisosID,
            token: generarJWT(elemento[0].UsuariosID)
        });
    }
}

const perfil = async (req, res) => {
    const { gestor } = req;
    res.json(gestor);
}

const registrarGestores = async (req, res) => {
    let resultado = "";
    const { gestor } = req;
    const { permisosid } = gestor;
    await check('nombres').notEmpty().withMessage('El campo Nombres no puede estar vacio.').run(req);
    await check('username').isEmail().withMessage('El campo Usuario es el E-Mail.').run(req);
    await check('clave').isLength({ min: 8 }).withMessage('La contraseña debe ser mayor a 8 caracteres').run(req);
    resultado = validationResult(req);
    if (permisosid != 0) {
        const error = new Error("Sin Permiso de Administrador para la funcion!");
        return res.status(401).json({ msg: error.message });
    } else {
        if (resultado.array().length > 0) {
            return res.status(400).json({ msg: "Se tienen errores" });
        }
        else {
            const existeUsuario = await Gestor.findOne({
                where: { username: req.body.username },
                attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'nombres', 'clave', 'permisosid', 'skillid', 'estado'] }
            });
            if (existeUsuario) {
                const error = new Error("Usuario ya registrado");
                return res.status(400).json({ msg: error.message });
            }
            else {
                try {
                    const gestor = new Gestor(req.body);
                    const gestorAlmacenado = { msg: "Registro Gestor Guardado con exito." }
                    await gestor.sequelize.query(`call spUsuariosInsert('${gestor.nombres}','${gestor.username}','${gestor.clave}','${gestor.permisosid}','${gestor.skillid}','${gestor.estado}');`,
                        { type: gestor.sequelize.QueryTypes.INSERT }
                    );
                    res.json(gestorAlmacenado);
                } catch (error) {
                    console.log(error);
                    res.json({ msg: "Error al guardar." });
                }
            }
        }
    }
};

const obtenerGestor = async (req, res) => {
    const { id } = req.params;
    const { gestor } = req;
    try {
        const existeUsuario = await Gestor.sequelize.query(`call spUsuariosSelect('${id}');`,
            { type: Gestor.sequelize.QueryTypes.SELECT }
        );
        const elemento = existeUsuario[0];
        const { permisosid } = gestor;
        if (!Object.keys(elemento).length) {
            const error = new Error("El usuario no existe");
            return res.status(404).json({ msg: error.message });
        }
        else {
            if (permisosid != 0) {
                const error = new Error("Sin Permiso de Administrador para la funcion!");
                return res.status(401).json({ msg: error.message });
            } else {
                res.json({
                    usuariosid: id,
                    nombres: elemento[0].Nombres,
                    username: elemento[0].UserName,
                    permisosid: elemento[0].PermisosID,
                    permisos: elemento[0].Permisos,
                    skillid: elemento[0].SkillID,
                    skill: elemento[0].Skill,
                    estado: elemento[0].Estado,
                    est: elemento[0].Est
                });
            }
        }
    } catch (error) {
        console.log(error);
        res.json({ msg: "Error en la Busqueda." });
    }

};

const actualizarGestor = async (req, res) => {
    const { id } = req.params;
    const { gestor } = req;
    try {
        const existeUsuario = await Gestor.sequelize.query(`call spUsuariosSelect('${id}');`,
            { type: Gestor.sequelize.QueryTypes.SELECT }
        );
        const elemento = existeUsuario[0];
        const { permisosid } = gestor;
        if (!Object.keys(elemento).length) {
            const error = new Error("El usuario no existe");
            return res.status(404).json({ msg: error.message });
        }
        else {
            if (permisosid != 0) {
                const error = new Error("Sin Permiso de Administrador para la funcion!");
                return res.status(401).json({ msg: error.message });
            } else {
                elemento[0].Nombres = req.body.nombres.trim() || elemento[0].Nombres;
                elemento[0].UserName = req.body.username.trim() || elemento[0].UserName;
                elemento[0].PermisosID = req.body.permisosid || elemento[0].PermisosID;
                elemento[0].SkillID = req.body.skillid || elemento[0].SkillID;
                elemento[0].Est = req.body.estado.trim() || elemento[0].Est;
                try {
                    const gestorAlmacenado = { msg: "Registro Gestor Actualizado con exito." }
                    await Gestor.sequelize.query(`call spUsuariosUpdate(${id},'${elemento[0].Nombres}','${elemento[0].UserName}','${elemento[0].PermisosID}','${elemento[0].SkillID}','${elemento[0].Est}');`,
                        { type: Gestor.sequelize.QueryTypes.UPDATE }
                    );
                    res.json(gestorAlmacenado);
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
const bloqueoGestor = async (req, res) => {
    const { id } = req.params;
    const { gestor } = req;
    try {
        const existeUsuario = await Gestor.sequelize.query(`call spUsuariosSelect('${id}');`,
            { type: Gestor.sequelize.QueryTypes.SELECT }
        );
        const elemento = existeUsuario[0];
        const { permisosid } = gestor;
        if (!Object.keys(elemento).length) {
            const error = new Error("El usuario no existe");
            return res.status(404).json({ msg: error.message });
        }
        else {
            if (permisosid != 0) {
                const error = new Error("Sin Permiso de Administrador para la funcion!");
                return res.status(401).json({ msg: error.message });
            } else {
                elemento[0].Est = "B";
                try {
                    const gestorAlmacenado = { msg: "Registro Gestor Bloqueado con exito." }
                    await Gestor.sequelize.query(`call spUsuariosUpdateEstado(${id},'${elemento[0].Est}');`,
                        { type: Gestor.sequelize.QueryTypes.UPDATE }
                    );
                    res.json(gestorAlmacenado);
                } catch (error) {
                    console.log(error);
                    res.json({ msg: "Error al Bloquear Gestor." });
                }
            }
        }
    } catch (error) {
        console.log(error);
        res.json({ msg: "Error en la Busqueda." });
    }
}
const obtenerGestores = async (req, res) => {
    const { gestor } = req;
    const { permisosid } = gestor;
    if (permisosid != 0) {
        const error = new Error("Sin Permiso de Administrador para la funcion!");
        return res.status(401).json({ msg: error.message });
    } else {
        try {
            const gestores = await Gestor.sequelize.query('select * from spUsuariosSelect0;',
                { type: Gestor.sequelize.QueryTypes.SELECT }
            );
            res.json(gestores);
        } catch (error) {
            console.log(error);
            res.json({ msg: "Error en la Busqueda." });
        }
    }
}
const actualizarClave = async (req, res) => {
    const { id } = req.params;
    const { gestor } = req;
    try {
        const existeUsuario = await Gestor.sequelize.query(`call spUsuariosSelect('${id}');`,
            { type: Gestor.sequelize.QueryTypes.SELECT }
        );
        const elemento = existeUsuario[0];
        const { permisosid } = gestor;
        if (!Object.keys(elemento).length) {
            const error = new Error("El usuario no existe");
            return res.status(404).json({ msg: error.message });
        }
        else {
            const clavenueva=req.body.clave.trim()
            try {
                const gestorAlmacenado = { msg: "Contraseña del Gestor Actualizado con exito." }
                await Gestor.sequelize.query(`call spUsuariosUpdateClave(${id},'${clavenueva}');`,
                    { type: Gestor.sequelize.QueryTypes.UPDATE }
                );
                res.json(gestorAlmacenado);
            } catch (error) {
                console.log(error);
                res.json({ msg: "Error al Actualizar Clave." });
            }

        }
    } catch (error) {
        console.log(error);
        res.json({ msg: "Error en la Busqueda." });
    }
}
export { obtenerGestores, registrarGestores, actualizarGestor, obtenerGestor, bloqueoGestor, autenticar, perfil, actualizarClave };