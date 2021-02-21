import { Router } from "express";
import {
    getAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
} from "../controllers/AddressController";
const router = Router();

router.route("/user/addresses").get(getAddresses);

router.route("/user/address/add").post(createAddress);

router.route("/user/address/update").put(updateAddress);

router.route("/user/address/delete").delete(deleteAddress);

export default router;
