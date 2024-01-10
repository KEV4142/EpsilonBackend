import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Skill=db.define("skill", {
    skillid:{
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
export default Skill;