import {Hono} from "hono";
import createToken from "../service.js";
import bcrypt from "bcryptjs";
import database from "../../../postgres/connection.js";
import {users, type UserRole} from "../../../postgres/schema.js";
import {count, eq} from "drizzle-orm";

const service = new Hono();

service.post("/register", async (context) => {
    const {email, password, firstName, lastName, address, phoneNumber} = await context.req.json();

    if (!email || !password) {
        return context.json({error: "Email and password required"}, 400);
    }

    const userExists = await database
        .select()
        .from(users)
        .where(eq(users.email, email));

    if (userExists.length > 0) {
        return context.json({error: "User already exists"}, 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const userCount = (await database
        .select({count: count()})
        .from(users))[0].count;

    let role: UserRole = "USER";

    if(userCount === 0) {
        role = "ADMIN";
    }

    const [user] = await database
        .insert(users)
        .values({
            email,
            passwordHash,
            role,
            firstName,
            lastName,
            address,
            phoneNumber

        })
        .returning();

    const token = await createToken(user);

    return context.json({
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
        },
    });
});

export default service;
