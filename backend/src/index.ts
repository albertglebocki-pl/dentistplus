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

        const dateTime = new Date(datetime);

        dateTime.setMinutes(0, 0, 0);

        const visit = await Visit.create({
            doctorId,
            patientId: userId,
            dateTime,
            description,
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
    const year = Number(c.req.param('year'));
    const week = Number(c.req.param('week'));
    const doctorId = c.req.query("doctorId") ? Number(c.req.query("doctorId")) : undefined;
    const currentUserId = Number(c.req.query("userId"));

    console.log(currentUserId);

    const range = getWeekDates(year, week);
    const start = range.monday;
    const endExclusive = new Date(range.friday);
    endExclusive.setDate(endExclusive.getDate() + 1);

    let query: any = {
        dateTime: { $gte: start, $lt: endExclusive }
    };
    if (doctorId) query.doctorId = doctorId;

    const visits = await Visit.find(query).sort({ dateTime: 1 });

    let calendarData: Record<number, { mine: number[], taken: number[] }> = {};

    visits.forEach(visit => {
        let day = (visit.dateTime.getDay() + 6) % 7;
        let hour = visit.dateTime.getHours();

        if (!calendarData[day]) {
            calendarData[day] = { mine: [], taken: [] };
        }

        if (visit.patientId === currentUserId) {
            calendarData[day].mine.push(hour);
        } else {
            calendarData[day].taken.push(hour);
        }
    });

    return c.json({ success: true, calendarData });
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
