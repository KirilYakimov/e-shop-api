import express = require("express");
import { Application, Request, Response } from "express";

// Routes
import IndexRoute from "./routes/index.routes";
import UserRoute from "./routes/auth/User.routes";
import AddressRoute from "./routes/Address.routes";

export class App {
    app: Application;

    constructor(private port?: number | string) {
        this.app = express();
        this.settings();
        this.middlewares();
        this.routes();
    }

    private settings() {
        this.app.set("port", process.env.PORT || 8080);
    }

    private middlewares() {
        // Body-parser middleware
        this.app.use(express.json());
    }

    private routes() {
        this.app.use(IndexRoute);
        this.app.use(UserRoute);
        this.app.use(AddressRoute);
    }

    async listen() {
        await this.app.listen(this.app.get("port"));
        console.log("Server on port", this.app.get("port"));
    }
}
