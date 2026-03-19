import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const WizardStep = sequelize.define("WizardStep",{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    slug:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    questionText:{
        type: DataTypes.TEXT,
        allowNull: false
    }},{
        tableName: "wizard_steps",
        timestamps: false
});

export default WizardStep;


