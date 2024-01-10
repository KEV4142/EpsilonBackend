import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Programacioness=db.define("programacioness", {
    programacionesid:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    casowf:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha:{
        type: DataTypes.DATE,
        allowNull: false
    },
    razonCasoid:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    usuariosid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tipo:{
        type: DataTypes.STRING,
        allowNull: false
    },
    estado:{
        type: DataTypes.STRING,
        allowNull: false
    }
});
export default Programacioness;