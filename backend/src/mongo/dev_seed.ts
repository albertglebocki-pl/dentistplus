import connectMongo from "./connection.js";
import {
  Patient,
  ProcedureCatalog,
  MedicalProcedure,
  Visit,
  Payment,
} from "./schema.js";

const mongoSeed = async () => {
  await connectMongo();

  await Patient.deleteMany({});
  await ProcedureCatalog.deleteMany({});
  await MedicalProcedure.deleteMany({});
  await Visit.deleteMany({});
  await Payment.deleteMany({});

  const patient = await Patient.create({
    patientId: 1001,
    toothStatusList: [
      { tooth: "11", status: "OK" },
      { tooth: "12", status: "CARIES" },
      { tooth: "36", status: "FILLED" },
    ],
  });

  const catalog = await ProcedureCatalog.insertMany([
    {
      name: "Composite Filling",
      description: "Standard composite restoration",
      defaultCost: 250,
      active: true,
    },
    {
      name: "Root Canal Treatment",
      description: "Endodontic treatment",
      defaultCost: 900,
      active: true,
    },
    {
      name: "Scaling",
      description: "Professional teeth cleaning",
      defaultCost: 200,
      active: true,
    },
  ]);

  const doctorId = 2;

  const visit1 = await Visit.create({
    doctorId,
    patientId: patient.patientId,
    dateTime: new Date("2026-04-20T10:00:00Z"),
    durationMinutes: 60,
    description: "Initial examination and fillings",
    status: "COMPLETED",
  });

  const procedure1 = await MedicalProcedure.create({
    patientId: patient.patientId,
    doctorId,
    date: new Date("2026-04-20T10:00:00Z"),
    description: "Treatment plan: fillings",
    treatments: [
      {
        tooth: "12",
        catalogItemId: catalog[0]._id,
        description: "Composite filling on tooth 12",
        cost: 250,
      },
      {
        tooth: "36",
        catalogItemId: catalog[0]._id,
        description: "Composite filling on tooth 36",
        cost: 250,
      },
    ],
    cost: 500,
  });

  visit1.medicalProcedureId = procedure1._id;
  await visit1.save();

  const payment1 = await Payment.create({
    patientId: patient.patientId,
    medicalProcedureId: procedure1._id,
    amount: 500,
    status: "PENDING",
    successUrl: "http://localhost/payment/success",
    errorUrl: "http://localhost/payment/failure",
  });

  const visit2 = await Visit.create({
    doctorId,
    patientId: patient.patientId,
    dateTime: new Date("2026-04-22T14:00:00Z"),
    durationMinutes: 90,
    description: "Root canal + scaling",
    status: "COMPLETED",
  });

  const procedure2 = await MedicalProcedure.create({
    patientId: patient.patientId,
    doctorId,
    date: new Date("2026-04-22T14:00:00Z"),
    description: "Endodontics + hygiene",
    treatments: [
      {
        tooth: "11",
        catalogItemId: catalog[1]._id,
        description: "Root canal on tooth 11",
        cost: 900,
      },
      {
        tooth: "21",
        catalogItemId: catalog[2]._id,
        description: "Scaling and polishing",
        cost: 200,
      },
    ],
    cost: 1100,
  });

  visit2.medicalProcedureId = procedure2._id;
  await visit2.save();

  const payment2 = await Payment.create({
    patientId: patient.patientId,
    medicalProcedureId: procedure2._id,
    amount: 1100,
    status: "PENDING",
    successUrl: "http://localhost/payment/success",
    errorUrl: "http://localhost/payment/failure",
  });

  console.log("Mongo seed completed");
  console.log({ payment1: payment1.token, payment2: payment2.token });
};

export default mongoSeed;
