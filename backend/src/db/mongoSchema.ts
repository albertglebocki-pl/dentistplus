import { Schema, model } from "mongoose";

const TOOTH_ENUM = [
    '11','12','13','14','15','16','17','18',
    '21','22','23','24','25','26','27','28',
    '31','32','33','34','35','36','37','38',
    '41','42','43','44','45','46','47','48'
];

const toothStatusSchema = new Schema({
    tooth: { type: String, enum: TOOTH_ENUM, required: true },
    status: { type: String, required: true },
});

const imageSchema = new Schema({
    image: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
});

const patientSchema = new Schema({
    userId: { type: Number, required: true, unique: true },
    toothStatuses: [toothStatusSchema],
    images: [imageSchema],
});

patientSchema.index({ userId: 1 });



const treatmentSchema = new Schema({
    tooth: { type: String, enum: TOOTH_ENUM, required: true },
    description: { type: String, required: true },
});

const medicalProcedureSchema = new Schema({
    patientId: { type: Number, required: true},
    date: { type: Date, required: true },
    cost: { type: Number, required: true },
    description: { type: String },
    treatments: [treatmentSchema],
});



const visitSchema = new Schema({
    doctorId: { type: Number, required: true },
    patientId: { type: Number, required: true},
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: {
        type: String,
        enum: ["BOOKED", "COMPLETED"],
        default: "BOOKED",
    },
    medicalProcedureId: {
        type: Schema.Types.ObjectId,
        ref: "MedicalProcedure",
    },
});

visitSchema.index(
    { doctorId: 1, date: 1, time: 1 },
    { unique: true }
);

export const Patient = model("Patient", patientSchema);
export const MedicalProcedure = model("MedicalProcedure", medicalProcedureSchema);
export const Visit = model("Visit", visitSchema);
