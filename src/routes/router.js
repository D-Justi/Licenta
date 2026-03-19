import express from "express";
import { Lawyer, WizardStep, WizardOption, Appointment } from '../models/index.js';
import { sendAppointmentConfirmation } from "../utils/emailService.js";

const router = express.Router();

router.get("/lawyers",async (req,res,next)=>{
    try{
        const lawyers = await Lawyer.findAll();

        return res.status(200).json(lawyers);
    }catch(err){
        next(err);
    }
});

router.get("/wizard", async (req, res, next) => {
    try {
        const steps = await WizardStep.findAll({
            include: [{
                model: WizardOption,
                as: 'options',
                include: [{
                    model: Lawyer,
                    as: 'recommendedLawyer'
                }]
            }]
        });

        return res.status(200).json(steps);
    } catch (err) {
        next(err);
    }
});

router.post("/appointments", async (req, res, next) => {
    try {
        const { name, phone, email, description, lawyer_id, appointment_date } = req.body;
        
        const parts = appointment_date.split(' la ora ');
        const datePart = parts[0]; 
        const timePart = parts[1]; 

        const [day, month, year] = datePart.split('.'); 
        const [hours, minutes] = timePart.split(':');  

        const finalDate = new Date(year, month - 1, day, hours, minutes);

        const newAppointment = await Appointment.create({
            clientName: name,      
            clientPhone: phone,  
            clientEmail: email,    
            description: description,
            appointmentDate: finalDate, 
            lawyerId: lawyer_id,    
            status: 'pending'    
        });

        await sendAppointmentConfirmation(email, name, "Consultație juridică", appointment_date);

        return res.status(201).json({ 
            message: 'success', 
            data: newAppointment 
        });

    } catch (err) {
        console.error("Eroare la salvarea programării:", err);
        res.status(500).json({ message: 'error', error: err.message });
    }
});

router.get("/appointments", async (req, res, next) => {
    try {
        const appointments = await Appointment.findAll();
 
        const formattedAppts = appointments.map(app => {
            const d = new Date(app.appointmentDate);
            const dateStr = d.toLocaleDateString('ro-RO');
            
            let h = d.getHours();
            let m = d.getMinutes();
            const timeStr = `${h < 10 ? '0'+h : h}:${m < 10 ? '0'+m : m}`;

            return {
                lawyer_id: app.lawyerId,
                appointment_date: `${dateStr} la ora ${timeStr}`
            };
        });

        res.status(200).json(formattedAppts);
    } catch (err) {
        next(err);
    }
});

export default router;

