import {serve} from "@hono/node-server";
import {Hono} from "hono";
import connectMongo from "./db/mongo.js";
import {Patient, MedicalProcedure, Visit} from "./db/mongoSchema.js";
import {getWeekDates} from "./utils.js";


const app = new Hono();

await connectMongo();

// All endpoints are redirected via Caddy to /api/
// Here's no need for explicitly coding that, but when calling /api/* prefix should be used

app.get("/", (c) => {
    return c.text("Hello Hono!");
});


// test endpoint
app.get("/test", async (c) => {
    return c.json({message: "backend works"});
});

app.post("/book-visit", async (c) => {
    try {
        const body = await c.req.json();
        const userId: number = body.userId;
        const doctorId: number = body.doctorId;
        const datetime: string = body.datetime;
        const description: string | undefined = body.description ? body.description : undefined;

        if (!userId || !doctorId || !datetime) {
            return c.json({error: "Missing required fields"}, 400);
        }

        const dt = new Date(datetime);
        dt.setMinutes(0);

        const date = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
        const time = String(dt.getHours());

        const visit = await Visit.create({
            doctorId: doctorId,
            patientId: userId,
            date: date,
            time: time,
            description: description,
            status: "BOOKED",
        });

        return c.json({success: true, visit}, 200);
    } catch (error: any) {
        if (error.code == 11000) {
            return c.json({error: "This time slot is already booked"}, 409);
        }

        return c.json({error: "Internal server error"}, 500);
    }
});

// Optional parameters:
// id - doctor id, if its left empty, aggregated visits for all doctors are returned
app.get("/get-visits/:year/:week", async (c) => {
    console.log("endpoint test")
    const year: number = Number(c.req.param('year'));
    const week: number = Number(c.req.param('week'));
    const id: number = Number(c.req.query("id"));

    const range = getWeekDates(year, week);

    console.log("test111", year, week, id, range);

    return c.json({success:true});
});

serve(
    {
        fetch: app.fetch,
        port: 3000,
    },
    (info) => {
        console.log(`Server is running on http://localhost:${info.port}`);
    },
);
