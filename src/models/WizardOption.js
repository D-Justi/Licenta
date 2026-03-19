import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const WizardOption = sequelize.define("WizardOption", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    label: {
        type: DataTypes.STRING,
        allowNull: false
    },
    clickCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    currentStepId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nextStepId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    recommendedLawyerId: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: "wizard_options",
    timestamps: false
});

export default WizardOption;
