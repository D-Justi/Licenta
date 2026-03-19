import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();


const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,{
        host: process.env.DB_HOST,
        dialect: "postgres",
        port: process.env.DB_PORT || 5432
    }
);

const connectDB = async ()=>{
    try{
        await sequelize.sync({alter: true});
        console.log('✅ Tabele sincronizate.');
    }catch(err){
        console.error("Eroare la conectare ",err);
        process.exit(1);
    }
};

export {sequelize, connectDB};



