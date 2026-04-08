import { db } from "$lib/server/db";
import { personalData, users } from "$lib/server/schema";
import { eq } from "drizzle-orm";
import {hashPassword} from "$lib/server/auth";

const userSelect = {
    id: users.id,
    email: users.email,
    active: users.active,
    role: users.role,
    firstName: personalData.firstName,
    lastName: personalData.lastName,
    address: personalData.address,
    phoneNumber: personalData.phoneNumber,
} as const;

const baseUserQuery = db
    .select(userSelect)
    .from(users)
    .leftJoin(personalData, eq(personalData.userId, users.id));

export async function getUsers() {
    return baseUserQuery;
}

export async function getPatients() {
    return baseUserQuery.where(eq(users.role, "USER"));
}

export async function getDoctors() {
    return baseUserQuery.where(eq(users.role, "DOCTOR"));
}

export async function isUserExist(email: string): Promise<boolean> {
    const existing = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

    return existing.length !== 0
}


export async function DEBUG_initData() {
    const seedUsers = [
        {
            email: "doctor1@test.com",
            password: "password123",
            role: "DOCTOR" as const,
            firstName: "John",
            lastName: "Smith",
            address: "Warsaw Street 1",
            phoneNumber: "111111111",
        },
        {
            email: "doctor2@test.com",
            password: "password123",
            role: "DOCTOR" as const,
            firstName: "Anna",
            lastName: "Kowalska",
            address: "Warsaw Street 2",
            phoneNumber: "222222222",
        },
        {
            email: "user1@test.com",
            password: "password123",
            role: "USER" as const,
            firstName: "Mike",
            lastName: "Brown",
            address: "Warsaw Street 3",
            phoneNumber: "333333333",
        },
    ];

    for (const u of seedUsers) {
        const existing = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, u.email),
        });

        if (existing) continue;

        const passwordHash = await hashPassword(u.password);

        const [createdUser] = await db
            .insert(users)
            .values({
                email: u.email,
                passwordHash,
                role: u.role,
                active: true,
            })
            .returning();

        await db.insert(personalData).values({
            userId: createdUser.id,
            firstName: u.firstName,
            lastName: u.lastName,
            address: u.address,
            phoneNumber: u.phoneNumber,
        });
    }

    console.log("DEBUG data initialized");
    console.log(await db.select().from(users));
}
