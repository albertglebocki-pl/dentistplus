import { Schema, model } from "mongoose";
import { randomUUID } from "crypto";

const TOOTH_ENUM = [
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
  "37",
  "38",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
  "47",
  "48",
];

const toothField = {
  type: String,
  enum: TOOTH_ENUM,
  required: true,
};

const patientSchema = new Schema({
  patientId: { type: Number, required: true, unique: true },
  toothStatusList: [
    {
      tooth: toothField,
      status: { type: String, required: true },
    },
  ],
});

const procedureCatalogSchema = new Schema(
  {
    name: String,
    description: String,
    defaultCost: { type: Number, min: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const treatmentSchema = new Schema({
  tooth: toothField,
  catalogItemId: { type: Schema.Types.ObjectId, ref: "ProcedureCatalog" },
  description: String,
  cost: { type: Number, min: 0 },
});

const medicalProcedureSchema = new Schema(
  {
    patientId: Number,
    doctorId: Number,
    date: Date,
    description: String,
    treatments: [treatmentSchema],
  },
  { timestamps: true },
);

const visitSchema = new Schema(
  {
    doctorId: Number,
    patientId: Number,
    dateTime: Date,
    durationMinutes: { type: Number, default: 60 },
    description: String,
    status: {
      type: String,
      enum: ["BOOKED", "COMPLETED", "CANCELLED"],
      default: "BOOKED",
    },
    medicalProcedureId: {
      type: Schema.Types.ObjectId,
      ref: "MedicalProcedure",
    },
    cancelledAd: Date,
  },
  { timestamps: true },
);

const paymentSchema = new Schema(
  {
    patientId: Number,
    medicalProcedureId: {
      type: Schema.Types.ObjectId,
      ref: "MedicalProcedure",
    },
    amount: Number,
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED"],
      default: "PENDING",
    },
    token: {
      type: String,
      unique: true,
      default: () => randomUUID(),
    },
    successUrl: String,
    errorUrl: String,
    paidAt: Date,
  },
  { timestamps: true },
);

const patientImageSchema = new Schema(
  {
    patientId: { type: Number, required: true },
    s3Key: { type: String, required: true },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    uploadedBy: { type: Number, required: true },
  },
  { timestamps: true },
);

export const Patient = model("Patient", patientSchema);
export const ProcedureCatalog = model(
  "ProcedureCatalog",
  procedureCatalogSchema,
);
export const MedicalProcedure = model(
  "MedicalProcedure",
  medicalProcedureSchema,
);
export const Visit = model("Visit", visitSchema);
export const Payment = model("Payment", paymentSchema);
export const PatientImage = model("PatientImage", patientImageSchema);
