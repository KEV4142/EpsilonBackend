import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const DetalleBitacora=db.define("detallebitacora", {
    detallebitacoraid:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    bitacoraid:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    observaciones:{
        type: DataTypes.STRING,
        allowNull: false
    },
    resolucioncasoid: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
    fechaagente:{
        type: DataTypes.DATE,
        allowNull: false
    },
    usuariosid:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    productivoid:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fechacierre:{
        type: DataTypes.DATE,
        allowNull: false
    },
    cantidad:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
});
export default DetalleBitacora;