import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Gestor=db.define("gestores", {
    usuariosid:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nombres:{
        type: DataTypes.STRING,
        allowNull: false
    },
    username:{
        type: DataTypes.STRING,
        allowNull: false
    },
    clave:{
        type: DataTypes.STRING,
        allowNull: false
    },
    permisosid:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    skillid:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estado:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "A"
    }
});
export default Gestor;