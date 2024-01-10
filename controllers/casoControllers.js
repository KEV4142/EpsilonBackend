import { check, validationResult } from 'express-validator';
import Bitacora from '../models/Bitacora.js';


const registrarCasoC = async (req, res) => {
    const { gestor } = req;
    const { usuariosid } = gestor;
    const { bitacora, detallebitacora, motivoretreg, aumentoretreg } = req.body;
    let { casowf, fecha, contrato, nombretitular, telefono, servicioid, nodozonadth, razoncasoid, tienda, ejecutivo, actividadid, estadoBitacora } = bitacora[0];
    let { observaciones, resolucioncasoid, fechaagente, productivoid, fechacierre, cantidad } = detallebitacora[0];
    let { descripcion, incremento } = motivoretreg[0];
    let { paquetes, cantidadd, upsell, ippp } = aumentoretreg[0];
    if (!casowf ||
        !fecha ||
        !contrato ||
        !nombretitular ||
        !telefono ||
        !servicioid ||
        !nodozonadth ||
        !razoncasoid ||
        !tienda ||
        !ejecutivo ||
        !actividadid ||
        !estadoBitacora
    ) {
        const error = new Error("El Objeto Bitacora con campos vacios!");
        return res.status(401).json({ msg: error.message });
    }
    else if (!observaciones ||
        !resolucioncasoid ||
        !fechaagente ||
        !productivoid ||
        !fechacierre ||
        !cantidad) {
        const error = new Error("El Objeto DetalleBitacora con campos vacios!");
        return res.status(208).json({ msg: error.message });
    }
    else if (!descripcion || !incremento) {
        const error = new Error("El Objeto motivoretreg con campos vacios!");
        return res.status(401).json({ msg: error.message });
    }
    else if (!paquetes || !cantidadd || !upsell || !ippp) {
        const error = new Error("El Objeto aumentoretreg con campos vacios!");
        return res.status(401).json({ msg: error.message });
    }
    else {
        estadoBitacora = "C";
        actividadid = "17";
        let elementoservicioid, elementorazoncasoid, elementoresolucioncasoid, elementoproductivoid, elementocaso;
        try {
            const existeServicioid = await Bitacora.sequelize.query(`select * from spServicioSelect0 where ServicioID='${servicioid}';`,
                { type: Bitacora.sequelize.QueryTypes.SELECT }
            );
            elementoservicioid = existeServicioid[0];
            const existerazoncasoid = await Bitacora.sequelize.query(`select * from spRazoncasoSelect0 where RazonCasoID='${razoncasoid}';`,
                { type: Bitacora.sequelize.QueryTypes.SELECT }
            );
            elementorazoncasoid = existerazoncasoid[0];
            const existeresolucioncasoid = await Bitacora.sequelize.query(`select * from spResolucionCasoSelect0 where ResolucionCasoID='${resolucioncasoid}';`,
                { type: Bitacora.sequelize.QueryTypes.SELECT }
            );
            elementoresolucioncasoid = existeresolucioncasoid[0];
            const existeproductivoid = await Bitacora.sequelize.query(`select * from spProductivoSelect0 where ProductivoID='${productivoid}';`,
                { type: Bitacora.sequelize.QueryTypes.SELECT }
            );
            elementoproductivoid = existeproductivoid[0];
            const existecaso = await Bitacora.sequelize.query(`call spBitacoraSelect0('${casowf}');`,
                { type: Bitacora.sequelize.QueryTypes.SELECT }
            );
            elementocaso = existecaso[0];
        } catch (error) {
            console.log(error);
            res.json({ msg: "Error en la busqueda." });
        }
        if (!elementoservicioid) {
            const error1 = new Error("El servicio no existe o esta bloqueado.");
            return res.status(404).json({ msg: error1.message });
        }
        else if (!elementorazoncasoid) {
            const error1 = new Error("El razon caso no existe o esta bloqueado.");
            return res.status(404).json({ msg: error1.message });
        }
        else if (!elementoresolucioncasoid) {
            const error1 = new Error("El resolucion caso no existe o esta bloqueado.");
            return res.status(404).json({ msg: error1.message });
        }
        else if (!elementoproductivoid) {
            const error1 = new Error("El elemento productivo no existe o esta bloqueado.");
            return res.status(404).json({ msg: error1.message });
        }
        else if (elementocaso[0] !== null && elementocaso[0] !== undefined) {
            const error1 = new Error("Ya se tiene un caso registrado");
            return res.status(404).json({ msg: error1.message });
        }
        else {
            try {
                const casoCAlmacenado = { msg: "Caso Guardado con exito." };
                await Bitacora.sequelize.query(`call spCasoNuevoInsert('${casowf}','${fecha}','${contrato}','${nombretitular}','${telefono}','${servicioid}','${nodozonadth}','${razoncasoid}','${tienda}','${ejecutivo}','${actividadid}','${estadoBitacora}','${observaciones}','${resolucioncasoid}','${fechaagente}','${usuariosid}','${productivoid}','${fechacierre}','${cantidad}','${descripcion}','${incremento}','${paquetes}','${cantidadd}','${upsell}','${ippp}');`,
                    { type: Bitacora.sequelize.QueryTypes.INSERT }
                );
                res.json(casoCAlmacenado);
            } catch (error) {
                console.log(error);
                res.json({ msg: "Error al guardar el Caso Nuevo." });
            }
        }
    }
};
const registrarCasoP = async (req, res) => {
    const { gestor } = req;
    const { usuariosid } = gestor;
    const { bitacora, detallebitacora, motivoretreg, aumentoretreg, programacioness } = req.body;
    let { casowf, fecha, contrato, nombretitular, telefono, servicioid, nodozonadth, razoncasoid, tienda, ejecutivo, actividadid, estadoBitacora } = bitacora[0];
    let { observaciones, resolucioncasoid, fechaagente, productivoid, fechacierre, cantidad } = detallebitacora[0];
    let { descripcion, incremento } = motivoretreg[0];
    let { paquetes, cantidadd, upsell, ippp } = aumentoretreg[0];
    let { fechap, tipo } = programacioness[0];
    if (!casowf ||
        !fecha ||
        !contrato ||
        !nombretitular ||
        !telefono ||
        !servicioid ||
        !nodozonadth ||
        !razoncasoid ||
        !tienda ||
        !ejecutivo ||
        !actividadid ||
        !estadoBitacora
    ) {
        const error = new Error("El Objeto Bitacora con campos vacios!");
        return res.status(401).json({ msg: error.message });
    }
    else if (!observaciones ||
        !resolucioncasoid ||
        !fechaagente ||
        !productivoid ||
        !fechacierre ||
        !cantidad) {
        const error = new Error("El Objeto DetalleBitacora con campos vacios!");
        return res.status(401).json({ msg: error.message });
    }
    else if (!descripcion || !incremento) {
        const error = new Error("El Objeto motivoretreg con campos vacios!");
        return res.status(401).json({ msg: error.message });
    }
    else if (!paquetes || !cantidadd || !upsell || !ippp) {
        const error = new Error("El Objeto aumentoretreg con campos vacios!");
        return res.status(401).json({ msg: error.message });
    }
    else if (!fechap || !tipo) {
        const error = new Error("El Objeto programacion con campos vacios!");
        return res.status(401).json({ msg: error.message });
    }
    else {
        estadoBitacora = "A";
        actividadid = "17";
        const fechaActual = new Date();
        const formatoFecha = `${fechaActual.getFullYear()}-${(fechaActual.getMonth() + 1).toString().padStart(2, '0')}-${fechaActual.getDate().toString().padStart(2, '0')} ${fechaActual.getHours().toString().padStart(2, '0')}:${fechaActual.getMinutes().toString().padStart(2, '0')}:${fechaActual.getSeconds().toString().padStart(2, '0')}`;
        fechacierre = formatoFecha;
        let elementoservicioid, elementorazoncasoid, elementoresolucioncasoid, elementoproductivoid, elementocaso;
        try {
            const existeServicioid = await Bitacora.sequelize.query(`select * from spServicioSelect0 where ServicioID='${servicioid}';`,
                { type: Bitacora.sequelize.QueryTypes.SELECT }
            );
            elementoservicioid = existeServicioid[0];
            const existerazoncasoid = await Bitacora.sequelize.query(`select * from spRazoncasoSelect0 where RazonCasoID='${razoncasoid}';`,
                { type: Bitacora.sequelize.QueryTypes.SELECT }
            );
            elementorazoncasoid = existerazoncasoid[0];
            const existeresolucioncasoid = await Bitacora.sequelize.query(`select * from spResolucionCasoSelect0 where ResolucionCasoID='${resolucioncasoid}';`,
                { type: Bitacora.sequelize.QueryTypes.SELECT }
            );
            elementoresolucioncasoid = existeresolucioncasoid[0];
            const existeproductivoid = await Bitacora.sequelize.query(`select * from spProductivoSelect0 where ProductivoID='${productivoid}';`,
                { type: Bitacora.sequelize.QueryTypes.SELECT }
            );
            elementoproductivoid = existeproductivoid[0];
            const existecaso = await Bitacora.sequelize.query(`call spBitacoraSelect0('${casowf}');`,
                { type: Bitacora.sequelize.QueryTypes.SELECT }
            );
            elementocaso = existecaso[0];
        } catch (error) {
            console.log(error);
            res.json({ msg: "Error en la busqueda." });
        }
        if (!elementoservicioid) {
            const error1 = new Error("El servicio no existe o esta bloqueado.");
            return res.status(404).json({ msg: error1.message });
        }
        else if (!elementorazoncasoid) {
            const error1 = new Error("El razon caso no existe o esta bloqueado.");
            return res.status(404).json({ msg: error1.message });
        }
        else if (!elementoresolucioncasoid) {
            const error1 = new Error("El resolucion caso no existe o esta bloqueado.");
            return res.status(404).json({ msg: error1.message });
        }
        else if (!elementoproductivoid) {
            const error1 = new Error("El elemento productivo no existe o esta bloqueado.");
            return res.status(404).json({ msg: error1.message });
        }
        else if (elementocaso[0] !== null && elementocaso[0] !== undefined) {
            const error1 = new Error("Ya se tiene un caso registrado");
            return res.status(404).json({ msg: error1.message });
        }
        else {
            try {
                const casoCAlmacenado = { msg: "Caso Guardado con exito." };
                await Bitacora.sequelize.query(`call spCasoNuevoPendInsert('${casowf}','${fecha}','${contrato}','${nombretitular}','${telefono}','${servicioid}','${nodozonadth}','${razoncasoid}','${tienda}','${ejecutivo}','${actividadid}','${estadoBitacora}','${observaciones}','${resolucioncasoid}','${fechaagente}','${usuariosid}','${productivoid}','${fechacierre}','${cantidad}','${descripcion}','${incremento}','${paquetes}','${cantidadd}','${upsell}','${ippp}','${fechap}','${tipo}');`,
                    { type: Bitacora.sequelize.QueryTypes.INSERT }
                );
                res.json(casoCAlmacenado);
            } catch (error) {
                console.log(error);
                res.json({ msg: "Error al guardar el Caso Nuevo." });
            }
        }
    }
};
const actualizarCasoC = async (req, res) => {
    const { id } = req.params;
    const { gestor } = req;
    const { usuariosid } = gestor;
    const { bitacora, detallebitacora, motivoretreg, aumentoretreg } = req.body;
    let { casowf } = bitacora[0];
    let { observaciones, resolucioncasoid, fechaagente, productivoid, fechacierre, cantidad } = detallebitacora[0];
    let { incremento } = motivoretreg[0];
    let { paquetes, cantidadd, upsell, ippp } = aumentoretreg[0];
    let fechap = "CIERRE", tipo = "RETENCIONES";
    let elementocaso;
    try {
        if (id.trim() === casowf.trim()) {
            const existecaso = await Bitacora.sequelize.query(`call spBitacoraSelect0('${id}');`,
                { type: Bitacora.sequelize.QueryTypes.SELECT }
            );
            elementocaso = existecaso[0];
            if (elementocaso[0] == null || elementocaso[0] == undefined) {
                const error1 = new Error("No se tiene un caso registrado");
                return res.status(404).json({ msg: error1.message });
            }
            else {
                if (!observaciones ||
                    !resolucioncasoid ||
                    !fechaagente ||
                    !productivoid ||
                    !fechacierre ||
                    !cantidad) {
                    const error = new Error("El Objeto DetalleBitacora con campos vacios!");
                    return res.status(401).json({ msg: error.message });
                }
                else if (!incremento) {
                    const error = new Error("El Objeto motivoretreg con campos vacios!");
                    return res.status(401).json({ msg: error.message });
                }
                else if (!paquetes || !cantidadd || !upsell || !ippp) {
                    const error = new Error("El Objeto aumentoretreg con campos vacios!");
                    return res.status(401).json({ msg: error.message });
                }
                else {
                    let estadoBitacora = "C";
                    let elementoresolucioncasoid, elementoproductivoid;
                    try {
                        const existeresolucioncasoid = await Bitacora.sequelize.query(`select * from spResolucionCasoSelect0 where ResolucionCasoID='${resolucioncasoid}';`,
                            { type: Bitacora.sequelize.QueryTypes.SELECT }
                        );
                        elementoresolucioncasoid = existeresolucioncasoid[0];
                        const existeproductivoid = await Bitacora.sequelize.query(`select * from spProductivoSelect0 where ProductivoID='${productivoid}';`,
                            { type: Bitacora.sequelize.QueryTypes.SELECT }
                        );
                        elementoproductivoid = existeproductivoid[0];

                    } catch (error) {
                        console.log(error);
                        res.json({ msg: "Error en la busqueda." });
                    }
                    if (!elementoresolucioncasoid) {
                        const error1 = new Error("El resolucion caso no existe o esta bloqueado.");
                        return res.status(404).json({ msg: error1.message });
                    }
                    else if (!elementoproductivoid) {
                        const error1 = new Error("El elemento productivo no existe o esta bloqueado.");
                        return res.status(404).json({ msg: error1.message });
                    }
                    else {
                        try {
                            const casoCAlmacenado = { msg: "Caso de Programacion cerrado con exito." };
                            await Bitacora.sequelize.query(`call spCasoPendCerrar('${casowf}','${elementocaso[0].BitacoraID}','${estadoBitacora}','${observaciones}','${resolucioncasoid}','${fechaagente}','${usuariosid}','${productivoid}','${fechacierre}','${cantidad}','${incremento}','${paquetes}','${cantidadd}','${upsell}','${ippp}','${fechap}','${tipo}');`,
                                { type: Bitacora.sequelize.QueryTypes.UPDATE }
                            );
                            res.json(casoCAlmacenado);
                        } catch (error) {
                            console.log(error);
                            res.json({ msg: "Error al Cerrar el Caso de Programacion." });
                        }
                    }
                }
            }
        } else {
            return res.json({ msg: "Error campos recibidos no son iguales." });
        }
    } catch (error) {
        console.log(error);
        res.json({ msg: "Error en la busqueda del caso." });
    }
};
const actualizarCasoP = async (req, res) => {
    const { id } = req.params;
    const { gestor } = req;
    const { usuariosid } = gestor;
    const { detallebitacora, programacioness } = req.body;
    let { observaciones, resolucioncasoid, fechaagente, productivoid, fechacierre, cantidad } = detallebitacora[0];
    let { fechap, tipo } = programacioness[0];
    let elementocaso;
    try {
        const existecaso = await Bitacora.sequelize.query(`call spBitacoraSelect0('${id}');`,
            { type: Bitacora.sequelize.QueryTypes.SELECT }
        );
        elementocaso = existecaso[0];
        if (elementocaso[0] == null || elementocaso[0] == undefined) {
            const error1 = new Error("No se tiene un caso registrado");
            return res.status(404).json({ msg: error1.message });
        }
        else {
            if (!observaciones ||
                !resolucioncasoid ||
                !fechaagente ||
                !productivoid ||
                !fechacierre ||
                !cantidad) {
                const error = new Error("El Objeto DetalleBitacora con campos vacios!");
                return res.status(401).json({ msg: error.message });
            }
            else if (!fechap || !tipo) {
                const error = new Error("El Objeto programacion con campos vacios!");
                return res.status(401).json({ msg: error.message });
            }
            else {
                let estadoBitacora = "A";
                const fechaActual = new Date();
                const formatoFecha = `${fechaActual.getFullYear()}-${(fechaActual.getMonth() + 1).toString().padStart(2, '0')}-${fechaActual.getDate().toString().padStart(2, '0')} ${fechaActual.getHours().toString().padStart(2, '0')}:${fechaActual.getMinutes().toString().padStart(2, '0')}:${fechaActual.getSeconds().toString().padStart(2, '0')}`;
                fechacierre = formatoFecha;
                let elementoresolucioncasoid, elementoproductivoid;
                try {
                    const existeresolucioncasoid = await Bitacora.sequelize.query(`select * from spResolucionCasoSelect0 where ResolucionCasoID='${resolucioncasoid}';`,
                        { type: Bitacora.sequelize.QueryTypes.SELECT }
                    );
                    elementoresolucioncasoid = existeresolucioncasoid[0];
                    const existeproductivoid = await Bitacora.sequelize.query(`select * from spProductivoSelect0 where ProductivoID='${productivoid}';`,
                        { type: Bitacora.sequelize.QueryTypes.SELECT }
                    );
                    elementoproductivoid = existeproductivoid[0];

                } catch (error) {
                    console.log(error);
                    res.json({ msg: "Error en la busqueda." });
                }
                if (!elementoresolucioncasoid) {
                    const error1 = new Error("El resolucion caso no existe o esta bloqueado.");
                    return res.status(404).json({ msg: error1.message });
                }
                else if (!elementoproductivoid) {
                    const error1 = new Error("El elemento productivo no existe o esta bloqueado.");
                    return res.status(404).json({ msg: error1.message });
                }
                else {
                    try {
                        const casoCAlmacenado = { msg: "Exito al actualizar Caso de Programacion pendiente nuevamente." };
                        await Bitacora.sequelize.query(`call spCasoPendPend('${id}','${elementocaso[0].BitacoraID}','${estadoBitacora}','${observaciones}','${resolucioncasoid}','${fechaagente}','${usuariosid}','${productivoid}','${fechacierre}','${cantidad}','${fechap}','${tipo}');`,
                            { type: Bitacora.sequelize.QueryTypes.UPDATE }
                        );
                        res.json(casoCAlmacenado);
                    } catch (error) {
                        console.log(error);
                        res.json({ msg: "Error al Cerrar el Caso de Programacion." });
                    }
                }
            }
        }

    } catch (error) {
        console.log(error);
        res.json({ msg: "Error en la busqueda del caso." });
    }
};
const actualizarCasoCR = async (req, res) => {
    const { id } = req.params;
    const { gestor } = req;
    const { usuariosid } = gestor;
    const { bitacora, detallebitacora, motivoretreg, aumentoretreg } = req.body;
    let { casowf } = bitacora[0];
    let { observaciones, resolucioncasoid, fechaagente, productivoid, fechacierre, cantidad } = detallebitacora[0];
    let { incremento } = motivoretreg[0];
    let { paquetes, cantidadd, upsell, ippp } = aumentoretreg[0];
    let elementocaso;
    try {
        if (id.trim() === casowf.trim()) {
            const existecaso = await Bitacora.sequelize.query(`call spBitacoraSelect0('${id}');`,
                { type: Bitacora.sequelize.QueryTypes.SELECT }
            );
            elementocaso = existecaso[0];
            if (elementocaso[0] == null || elementocaso[0] == undefined) {
                const error1 = new Error("No se tiene un caso registrado");
                return res.status(404).json({ msg: error1.message });
            }
            else {
                if (!observaciones ||
                    !resolucioncasoid ||
                    !fechaagente ||
                    !productivoid ||
                    !fechacierre ||
                    !cantidad) {
                    const error = new Error("El Objeto DetalleBitacora con campos vacios!");
                    return res.status(401).json({ msg: error.message });
                }
                else if (!incremento) {
                    const error = new Error("El Objeto motivoretreg con campos vacios!");
                    return res.status(401).json({ msg: error.message });
                }
                else if (!paquetes || !cantidadd || !upsell || !ippp) {
                    const error = new Error("El Objeto aumentoretreg con campos vacios!");
                    return res.status(401).json({ msg: error.message });
                }
                else {
                    let estadoBitacora = "C";
                    let elementoresolucioncasoid, elementoproductivoid;
                    try {
                        const existeresolucioncasoid = await Bitacora.sequelize.query(`select * from spResolucionCasoSelect0 where ResolucionCasoID='${resolucioncasoid}';`,
                            { type: Bitacora.sequelize.QueryTypes.SELECT }
                        );
                        elementoresolucioncasoid = existeresolucioncasoid[0];
                        const existeproductivoid = await Bitacora.sequelize.query(`select * from spProductivoSelect0 where ProductivoID='${productivoid}';`,
                            { type: Bitacora.sequelize.QueryTypes.SELECT }
                        );
                        elementoproductivoid = existeproductivoid[0];

                    } catch (error) {
                        console.log(error);
                        res.json({ msg: "Error en la busqueda." });
                    }
                    if (!elementoresolucioncasoid) {
                        const error1 = new Error("El resolucion caso no existe o esta bloqueado.");
                        return res.status(404).json({ msg: error1.message });
                    }
                    else if (!elementoproductivoid) {
                        const error1 = new Error("El elemento productivo no existe o esta bloqueado.");
                        return res.status(404).json({ msg: error1.message });
                    }
                    else {
                        try {
                            const casoCAlmacenado = { msg: "Caso de Retornado cerrado con exito." };
                            await Bitacora.sequelize.query(`call spCasoRetornadoCerrar('${casowf}','${elementocaso[0].BitacoraID}','${estadoBitacora}','${observaciones}','${resolucioncasoid}','${fechaagente}','${usuariosid}','${productivoid}','${fechacierre}','${cantidad}','${incremento}','${paquetes}','${cantidadd}','${upsell}','${ippp}');`,
                                { type: Bitacora.sequelize.QueryTypes.UPDATE }
                            );
                            res.json(casoCAlmacenado);
                        } catch (error) {
                            console.log(error);
                            res.json({ msg: "Error al Cerrar el Caso Retornado." });
                        }
                    }
                }
            }
        } else {
            return res.json({ msg: "Error campos recibidos no son iguales." });
        }
    } catch (error) {
        console.log(error);
        res.json({ msg: "Error en la busqueda del caso." });
    }
};
const actualizarCasoPR = async (req, res) => {
    const { id } = req.params;
    const { gestor } = req;
    const { usuariosid } = gestor;
    const { detallebitacora, programacioness } = req.body;
    let { observaciones, resolucioncasoid, fechaagente, productivoid, fechacierre, cantidad } = detallebitacora[0];
    let { fechap, tipo } = programacioness[0];
    let elementocaso;
    try {
        const existecaso = await Bitacora.sequelize.query(`call spBitacoraSelect0('${id}');`,
            { type: Bitacora.sequelize.QueryTypes.SELECT }
        );
        elementocaso = existecaso[0];
        if (elementocaso[0] == null || elementocaso[0] == undefined) {
            const error1 = new Error("No se tiene un caso registrado");
            return res.status(404).json({ msg: error1.message });
        }
        else {
            if (!observaciones ||
                !resolucioncasoid ||
                !fechaagente ||
                !productivoid ||
                !fechacierre ||
                !cantidad) {
                const error = new Error("El Objeto DetalleBitacora con campos vacios!");
                return res.status(401).json({ msg: error.message });
            }
            else if (!fechap || !tipo) {
                const error = new Error("El Objeto programacion con campos vacios!");
                return res.status(401).json({ msg: error.message });
            }
            else {
                let estadoBitacora = "A";
                const fechaActual = new Date();
                const formatoFecha = `${fechaActual.getFullYear()}-${(fechaActual.getMonth() + 1).toString().padStart(2, '0')}-${fechaActual.getDate().toString().padStart(2, '0')} ${fechaActual.getHours().toString().padStart(2, '0')}:${fechaActual.getMinutes().toString().padStart(2, '0')}:${fechaActual.getSeconds().toString().padStart(2, '0')}`;
                fechacierre = formatoFecha;
                let elementoresolucioncasoid, elementoproductivoid;
                try {
                    const existeresolucioncasoid = await Bitacora.sequelize.query(`select * from spResolucionCasoSelect0 where ResolucionCasoID='${resolucioncasoid}';`,
                        { type: Bitacora.sequelize.QueryTypes.SELECT }
                    );
                    elementoresolucioncasoid = existeresolucioncasoid[0];
                    const existeproductivoid = await Bitacora.sequelize.query(`select * from spProductivoSelect0 where ProductivoID='${productivoid}';`,
                        { type: Bitacora.sequelize.QueryTypes.SELECT }
                    );
                    elementoproductivoid = existeproductivoid[0];

                } catch (error) {
                    console.log(error);
                    res.json({ msg: "Error en la busqueda." });
                }
                if (!elementoresolucioncasoid) {
                    const error1 = new Error("El resolucion caso no existe o esta bloqueado.");
                    return res.status(404).json({ msg: error1.message });
                }
                else if (!elementoproductivoid) {
                    const error1 = new Error("El elemento productivo no existe o esta bloqueado.");
                    return res.status(404).json({ msg: error1.message });
                }
                else {
                    try {
                        const casoCAlmacenado = { msg: "Exito al retornar Caso de Programacion pendiente nuevamente." };
                        await Bitacora.sequelize.query(`call spCasoRetornadoPend('${id}','${elementocaso[0].BitacoraID}','${elementocaso[0].RazonCasoID}','${estadoBitacora}','${observaciones}','${resolucioncasoid}','${fechaagente}','${usuariosid}','${productivoid}','${fechacierre}','${cantidad}','${fechap}','${tipo}');`,
                            { type: Bitacora.sequelize.QueryTypes.UPDATE }
                        );
                        res.json(casoCAlmacenado);
                    } catch (error) {
                        console.log(error);
                        res.json({ msg: "Error al retornar el Caso de Programacion." });
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
        res.json({ msg: "Error en la busqueda del caso." });
    }
};

const obtenerCasosPendietes = async (req, res) => {
    const { id } = req.params;
    try {
        const Programaciones = await Bitacora.sequelize.query('select ProgramacionesID,CasoWF,fecha,Descripcion,Tipo,Estado from spProgramacionessSelect0;',
            { type: Bitacora.sequelize.QueryTypes.SELECT }
        );
        res.json(Programaciones);
    } catch (error) {
        console.log(error);
        res.json({ msg: "Error en la Busqueda de Programaciones." });
    }
};


const obtenerCaso = async (req, res) => {
    const { id } = req.params;
    const { gestor } = req;
    try {
        const existeBitacora = await Bitacora.sequelize.query(`call spBitacoraSelect0('${id}');`,
            { type: Bitacora.sequelize.QueryTypes.SELECT }
        );
        const elemento = existeBitacora[0];

        if (!Object.keys(elemento).length) {
            const error = new Error("El Caso Caso no existe");
            return res.status(404).json({ msg: error.message });
        }
        else {
            const existeCantidad = await Bitacora.sequelize.query(`call spDetalleBitacoraSelect0('${id}');`,
                { type: Bitacora.sequelize.QueryTypes.SELECT }
            );
            const cantidadAct = existeCantidad[0];
            res.json({
                bitacoraid: elemento[0].BitacoraID,
                casowf: id,
                fecha: elemento[0].Fecha,
                contrato: elemento[0].Contrato,
                nombretitular: elemento[0].NombreTitular,
                telefono: elemento[0].Telefono,
                servicioid: elemento[0].ServicioID,
                nodozonadth: elemento[0].NodoZonaDTH,
                razoncasoid: elemento[0].RazonCasoID,
                tienda: elemento[0].Tienda,
                ejecutivo: elemento[0].Ejecutivo,
                servicioid: elemento[0].ServicioID,
                estado: elemento[0].EstadoCaso,
                cantidad: cantidadAct[0].num,
                descripcionservicio: elemento[0].DescrSer,
                descripcionrazon: elemento[0].DesRa,
                descripcionmotretreg: elemento[0].DesMotRetReg

            });
        }
    }
    catch (error) {
        console.log(error);
        res.json({ msg: "Error en la Busqueda." });
    }
}

const obtenerCasoRetornado = async (req, res) => {
    const { id } = req.params;
    const { gestor } = req;
    try {
        const existeBitacora = await Bitacora.sequelize.query(`call spBitacoraSelect5('${id}');`,
            { type: Bitacora.sequelize.QueryTypes.SELECT }
        );
        const elemento = existeBitacora[0];

        if (!Object.keys(elemento).length) {
            const error = new Error("El Caso Caso no existe o no esta cerrado.");
            return res.status(404).json({ msg: error.message });
        }
        else {
            const existeCantidad = await Bitacora.sequelize.query(`call spDetalleBitacoraSelect0('${id}');`,
                { type: Bitacora.sequelize.QueryTypes.SELECT }
            );
            const cantidadAct = existeCantidad[0];
            res.json({
                bitacoraid: elemento[0].BitacoraID,
                casowf: id,
                fecha: elemento[0].Fecha,
                contrato: elemento[0].Contrato,
                nombretitular: elemento[0].NombreTitular,
                telefono: elemento[0].Telefono,
                servicioid: elemento[0].ServicioID,
                nodozonadth: elemento[0].NodoZonaDTH,
                razoncasoid: elemento[0].RazonCasoID,
                tienda: elemento[0].Tienda,
                ejecutivo: elemento[0].Ejecutivo,
                servicioid: elemento[0].ServicioID,
                estado: elemento[0].EstadoCaso,
                cantidad: cantidadAct[0].num,
                descripcionservicio: elemento[0].DescrSer,
                descripcionrazon: elemento[0].DesRa,
                descripcionmotretreg: elemento[0].DesMotRetReg

            });
        }
    }
    catch (error) {
        console.log(error);
        res.json({ msg: "Error en la Busqueda." });
    }
}

const obtenerReporte = async (req, res) => {
    const { gestor } = req;
    const { fechai, fechaf } = req.body;
    const { permisosid } = gestor;
    if (permisosid != 0) {
        const error = new Error("Sin Permiso de Administrador/Reporteria para la funcion!");
        return res.status(401).json({ msg: error.message });
    } else {
    try {
        const data = await Bitacora.sequelize.query(`call spReporte42('${fechai}','${fechaf}',17)`,
            { type: Bitacora.sequelize.QueryTypes.SELECT }
        );
        res.json(data);

    } catch (error) {
        console.log(error);
        res.json({ msg: "Error en el reporte." });
    }
    }

};
export { registrarCasoC, registrarCasoP, actualizarCasoC, actualizarCasoP, actualizarCasoCR, actualizarCasoPR, obtenerCasosPendietes, obtenerCaso, obtenerCasoRetornado, obtenerReporte };