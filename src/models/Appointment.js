import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Appointment = sequelize.define("Appointment", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    clientName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    clientPhone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    clientEmail: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    appointmentDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING, 
        defaultValue: 'pending',
        allowNull: false
    }
});

export default Appointment;

