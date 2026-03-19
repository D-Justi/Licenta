import { sequelize } from "../config/db.js";
import Lawyer from "./Lawyer.js";
import Appointment from "./Appointment.js";
import WizardStep from "./WizardStep.js";
import WizardOption from "./WizardOption.js";

Lawyer.hasMany(Appointment, { 
    foreignKey: 'lawyerId', 
    onDelete: 'CASCADE'
});

Appointment.belongsTo(Lawyer, { 
    foreignKey: 'lawyerId' 
});


WizardStep.hasMany(WizardOption, { 
    foreignKey: 'currentStepId',
    as: 'options'              
});

WizardOption.belongsTo(WizardStep, { 
    foreignKey: 'currentStepId' 
});


WizardOption.belongsTo(WizardStep, { 
    foreignKey: 'nextStepId', 
    as: 'nextStep'
});


WizardOption.belongsTo(Lawyer, { 
    foreignKey: 'recommendedLawyerId',
    as: 'recommendedLawyer'
});

export { sequelize, Lawyer, Appointment, WizardStep, WizardOption };

