import { Router } from "express";
import { createUser, loginUser } from "../../controllers/auth/UserController";

const router = Router();

router.route("/user/register").post(createUser);

router.route("/user/login").post(loginUser);

export default router;
