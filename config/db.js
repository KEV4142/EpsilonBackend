import dotenv from 'dotenv';
import Sequelize from 'sequelize';
dotenv.config();
const db=new Sequelize(process.env.BASE_DATOS, process.env.USUARIO, process.env.CONTRASE, {
    host:  process.env.HOSTT,
    port: process.env.PORTT,
    dialect: process.env.DIALECTO,
    logging: false,
    pool:{
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorAliasses: false
  });
export default db;