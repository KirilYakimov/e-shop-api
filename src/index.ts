import { App } from "./app";
import { connection } from "./util/db.connection";

async function main() {
    const app = new App();
    await connection();
    await app.listen();
}

main();
