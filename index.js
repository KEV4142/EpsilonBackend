import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './config/db.js';
import gestoresRoutes from './routes/gestoresRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import servicioRoutes from './routes/servicioRoutes.js';
import razoncasoRoutes from './routes/razoncasoRoutes.js';
import resolucioncasoRoutes from './routes/resolucioncasoRoutes.js';
import motivoretRoutes from './routes/motivoretRoutes.js';
import casoRoutes from './routes/casoRoutes.js';

const app=express();
app.use(express.json());
dotenv.config();

try {
    await db.authenticate();
    console.log("conectado");
} catch (error) {
    console.log(`error: ${error.message}`);
    process.exit(1);
}

const whitelist=["http://localhost:5173"];
const corsOption={
    origin: function(origin,callback){
        //console.log(origin);
        if(whitelist.includes(origin)){
            callback(null, true);
        }else{
            callback(new Error("Error en conexión"));
        }
    }
} 
app.use(cors(corsOption));
//routing
app.use('/api/gestores',gestoresRoutes);
app.use('/api/skills',skillRoutes);
app.use('/api/servicios',servicioRoutes);
app.use('/api/razoncaso',razoncasoRoutes);
app.use('/api/resolucioncaso',resolucioncasoRoutes);
app.use('/api/motivoret',motivoretRoutes);
app.use('/api/caso',casoRoutes);

const PORT= process.env.PORT || 4000;

app.listen(PORT, ()=>{
    console.log("desde el puerto 41");
});