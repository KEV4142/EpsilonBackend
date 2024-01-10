import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const AumentoRetReg=db.define("aumentoretreg", {
    aumentoretregid:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    casowf:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    paquetes:{
        type: DataTypes.STRING,
        allowNull: false
    },
    cantidadd:{
        type: DataTypes.STRING,
        allowNull: false
    },
    upsell:{
        type: DataTypes.STRING,
        allowNull: false
    },
    ippp:{
        type: DataTypes.STRING,
        allowNull: false
    },
    usuariosid: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});
export default AumentoRetReg;