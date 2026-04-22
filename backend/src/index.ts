import { Hono } from "hono";
import { serve } from "@hono/node-server";
import connectMongo from "./mongo/connection.js";
import ping from "./services/ping.js";

import postgresSeed from "./postgres/dev_seed.js";

import login from "./services/auth/routes/login.js";
import register from "./services/auth/routes/register.js";
import me from "./services/auth/routes/me.js";

import adminDoctors from "./services/admin/routes/doctors.js";
import adminUsers from "./services/admin/routes/users.js";

import visitList from "./services/visits/routes/list.js";
import visitSlots from "./services/visits/routes/slots.js";
import visitDetails from "./services/visits/routes/details.js";
import visitCreate from "./services/visits/routes/create.js";
import visitUpdate from "./services/visits/routes/update.js";
import visitCancel from "./services/visits/routes/cancel.js";

import procedureList from "./services/procedures/routes/list.js";
import procedureDetails from "./services/procedures/routes/details.js";
import procedureCreate from "./services/procedures/routes/create.js";
import procedureUpdate from "./services/procedures/routes/update.js";

import paymentPay from "./services/payments/routes/pay.js";
import paymentFail from "./services/payments/routes/fail.js";
import paymentList from "./services/payments/routes/list.js";
import paymentDetails from "./services/payments/routes/details.js";
import paymentCreate from "./services/payments/routes/create.js";

import catalogList from "./services/catalog/routes/list.js";
import catalogDetails from "./services/catalog/routes/details.js";
import catalogCreate from "./services/catalog/routes/create.js";
import catalogUpdate from "./services/catalog/routes/update.js";
import catalogDeactivate from "./services/catalog/routes/deactivate.js";

import patientList from "./services/patients/routes/list.js";
import patientMe from "./services/patients/routes/me.js";
import patientDetails from "./services/patients/routes/details.js";

import doctorList from "./services/doctors/routes/list.js";

import teethStatus from "./services/teeth/routes/status.js";
import teethUpdate from "./services/teeth/routes/update.js";
import teethProcedures from "./services/teeth/routes/procedures.js";

import imageUpload from "./services/images/routes/upload.js";
import imageList from "./services/images/routes/list.js";
import imageDetails from "./services/images/routes/details.js";
import imageDelete from "./services/images/routes/delete.js";

const app = new Hono();

await connectMongo();

if (process.env.MODE == "DEV") {
  await postgresSeed();
}

app.route("/", ping);

app.route("/auth", login);
app.route("/auth", register);
app.route("/auth", me);

app.route("/admin", adminDoctors);
app.route("/admin", adminUsers);

app.route("/visits", visitList);
app.route("/visits", visitSlots);
app.route("/visits", visitDetails);
app.route("/visits", visitCreate);
app.route("/visits", visitUpdate);
app.route("/visits", visitCancel);

app.route("/procedures", procedureList);
app.route("/procedures", procedureDetails);
app.route("/procedures", procedureCreate);
app.route("/procedures", procedureUpdate);

app.route("/payments", paymentPay);
app.route("/payments", paymentFail);
app.route("/payments", paymentList);
app.route("/payments", paymentDetails);
app.route("/payments", paymentCreate);

app.route("/catalog", catalogList);
app.route("/catalog", catalogDetails);
app.route("/catalog", catalogCreate);
app.route("/catalog", catalogUpdate);
app.route("/catalog", catalogDeactivate);

app.route("/patients", patientList);
app.route("/patients", patientMe);
app.route("/patients", patientDetails);

app.route("/patients", teethStatus);
app.route("/patients", teethUpdate);
app.route("/patients", teethProcedures);

app.route("/patients", imageUpload);
app.route("/patients", imageList);
app.route("/patients", imageDetails);
app.route("/patients", imageDelete);

app.route("/doctors", doctorList);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
