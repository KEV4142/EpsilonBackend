import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Servicio=db.define("servicio", {
    servicioid:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    descripcion:{
        type: DataTypes.STRING,
        allowNull: false
    },
    estado:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "A"
    },
    usuariosid:{
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue:null
    }
});
export default Servicio;