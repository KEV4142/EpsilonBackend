import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const MotivoRet=db.define("motivoret", {
    motivoretid:{
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
    skillid:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    usuariosid:{
        type: DataTypes.INTEGER,
        allowNull: true
    }
});
export default MotivoRet;