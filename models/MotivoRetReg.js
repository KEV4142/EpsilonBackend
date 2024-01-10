import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const MotivoRetReg=db.define("motivoretreg", {
    motivoretregid:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    casowf:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    descripcion:{
        type: DataTypes.STRING,
        allowNull: false
    },
    usuariosid: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
    incremento:{
        type: DataTypes.FLOAT,
        allowNull: false
    }
});
export default MotivoRetReg;
