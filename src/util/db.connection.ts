import { createConnection } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

export async function connection() {
    try {
        const connection = await createConnection({
            type: "postgres",
            port: Number(process.env.DB_PORT),
            host: process.env.DB_HOST,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            synchronize: true,
            logging: false,
            entities: ["src/entity/**/*.ts"],
            migrations: ["src/migration/**/*.ts"],
            subscribers: ["src/subscriber/**/*.ts"],
            cli: {
                entitiesDir: "src/entity",
                migrationsDir: "src/migration",
                subscribersDir: "src/subscriber",
            },
            namingStrategy: new SnakeNamingStrategy(),
        });

        console.log("Connected to database.");

        return connection;
    } catch (err) {
        console.log("Error: ", err);
        return err;
    }
}
