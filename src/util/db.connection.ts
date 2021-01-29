import { createConnection } from "typeorm";

export async function connection() {
    try {
        const connection = await createConnection();
        console.log("Connected to database.");
    } catch (err) {
        return err;
    }
    return connection;
}
