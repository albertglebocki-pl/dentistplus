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
    const year: number = Number(c.req.param('year'));
    const week: number = Number(c.req.param('week'));
    const doctorId: number | undefined = Number(c.req.query("doctorId"));

    const range = getWeekDates(year, week);

    const start: Date = range.monday;
    const end: Date = range.friday;
    const endExclusive = new Date(end);
    endExclusive.setDate(endExclusive.getDate() + 1);

    let calendarData: Record<number, number[]> = {};
    let visits;

    if(doctorId) {
        visits = await Visit
            .find({
                doctorId,
                dateTime: {
                    $gte: start,
                    $lt: endExclusive,
                },
            })
            .sort({ dateTime: 1 });
    }
    else {
        visits = await Visit
            .find({
                dateTime: {
                    $gte: start,
                    $lt: endExclusive,
                },
            })
            .sort({ dateTime: 1 });
    }

    visits.forEach(visit => {
        let day = visit.dateTime.getDay() - 1; // Monday = 0, so weekends are broken, but we don't use them anyway
        let hour = visit.dateTime.getHours();

        if( ! calendarData[day]) {
            calendarData[day] = []
        }

        calendarData[day].push(hour);
    })

    Object.values(calendarData).forEach(arr => {
        arr.sort((a, b) => a - b);
    });

    return c.json({success:true, calendarData});
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
