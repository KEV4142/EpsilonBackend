import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Bitacora=db.define("bitacora", {
    bitacoraid:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    casowf:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
      },
    contrato:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nombretitular:{
        type: DataTypes.STRING,
        allowNull: false
    },
    telefono:{
        type: DataTypes.STRING,
        allowNull: false
    },
    servicioid:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nodozonadth:{
        type: DataTypes.STRING,
        allowNull: false
    },
    razoncasoid:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tienda:{
        type: DataTypes.STRING,
        allowNull: false
    },
    ejecutivo:{
        type: DataTypes.STRING,
        allowNull: false
    },
    estado:{
        type: DataTypes.STRING,
        allowNull: false
    },
    actividadid:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
});
export default Bitacora;