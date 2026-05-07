import bcrypt from "bcryptjs";
import database from "./connection.js";
import {users} from "./schema.js";

const postgresSeed = async () => {
    const testUsers = [
        {
            email: "admin@admin.pl",
            passwordHash: await bcrypt.hash('admin123', 10),
            role: "ADMIN" as const,
            firstName: "Marek",
            lastName: "Administrator",
            phoneNumber: "111222333",
            address: null,
        },
        {
            email: "doctor1@test.pl",
            passwordHash: await bcrypt.hash('password', 10),
            role: "DOCTOR" as const,
            firstName: "Anna",
            lastName: "Nowak",
            phoneNumber: "555000111",
            address: null,
        },
        {
            email: "doctor2@test.pl",
            passwordHash: await bcrypt.hash('password', 10),
            role: "DOCTOR" as const,
            firstName: "Jan",
            lastName: "Kowalski",
            phoneNumber: "555000222",
            address: null,
        },
        {
            email: "user1@test.pl",
            passwordHash: await bcrypt.hash('password', 10),
            role: "USER" as const,
            firstName: "Tomasz",
            lastName: "Zieliński",
            address: "ul. Sezamkowa 1, Warszawa",
            phoneNumber: "999888777",
        },
        {
            email: "user2@test.pl",
            passwordHash: await bcrypt.hash('password', 10),
            role: "USER" as const,
            firstName: "Katarzyna",
            lastName: "Wójcik",
            address: "ul. Kwiatowa 5, Kraków",
            phoneNumber: "666555444",
        },
    ];

    try {
        await database.insert(users).values(testUsers);
        console.log("Added 5 temporary dev users");
    } catch (error) {
        console.error("Error", error);
    }
}

export default postgresSeed;