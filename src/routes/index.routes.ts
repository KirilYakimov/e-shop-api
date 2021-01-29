import { Router } from "express";
import { index } from "../controllers/HomeController";

const router = Router();

router.route("/").get(index);

export default router;
