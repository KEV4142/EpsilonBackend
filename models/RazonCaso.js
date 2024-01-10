import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const RazonCaso=db.define("razoncaso", {
    razoncasoid:{
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
        allowNull: true,
        defaultValue:null
    }
});
export default RazonCaso;