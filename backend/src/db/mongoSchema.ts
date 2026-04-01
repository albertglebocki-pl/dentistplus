import { Schema, model } from "mongoose";

const toothStatusSchema = new Schema({
    tooth: { type: String, required: true },
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
    tooth: { type: String, required: true },
    description: { type: String, required: true },
});

const medicalProcedureSchema = new Schema({
    patientId: { type: Number, required: true},
    date: { type: Date, required: true },
    cost: { type: Number, required: true },
    treatments: [treatmentSchema],
});



const visitSchema = new Schema({
    doctorId: { type: Number, required: true },
    patientId: { type: Number, required: true},
    date: { type: Date, required: true },
    time: { type: Number, required: true },
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
