import { DataTypes } from "sequelize"
import { sequelize } from "../config/db.js"

const Lawyer = sequelize.define("Lawyer",{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    slug: {
        type:DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imagePath: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    specialization: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

export default Lawyer;
