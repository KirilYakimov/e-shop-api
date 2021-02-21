import * as dotenv from "dotenv";
import { App } from "./app";
import { connection } from "./util/db.connection";

async function main() {
    await dotenv.config();
    const app = new App();
    await connection();
    await app.listen();
}

main();
