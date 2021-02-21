import { Router } from "express";
import {
    registerUser,
    loginUser,
    deleteUser,
    refreshTokenUser,
    resetUserPassword,
} from "../../controllers/auth/UserController";

const router = Router();

router.route("/auth/register").post(registerUser);

router.route("/auth/login").post(loginUser);

router.route("/auth/delete").delete(deleteUser);

router.route("/auth/refresh-token").post(refreshTokenUser);

// TODO
router.route("/auth/reset-password").post(resetUserPassword);

export default router;
