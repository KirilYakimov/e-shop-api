import { Request, Response } from "express";
import { getManager } from "typeorm";

import { Auth } from "../util/jwt";
import AddressDto from "../dto/address.dto";
import Address from "../entity/Address";

/**
 * @description Get all active addresses for a user
 * @param req header: tooken
 */
export const getAddresses = async (req: Request, res: Response) => {
    // Get data from request
    const token = req.headers.authorization.split(" ");
    const auth = await Auth(token[1]);

    // Validate
    if (!auth.auth) {
        return res.status(auth.status).json({
            error: "1",
            massage: auth.message,
        });
    }

    try {
        const addressRepository = getManager().getRepository(Address);
        const addresses = await addressRepository.find({
            user: auth.user,
            isActive: true,
        });

        return res.status(200).json({
            success: "1",
            addresses: addresses,
        });
    } catch (error) {
        return res.status(404).json({
            error: "1",
            massage: "Not found!",
        });
    }
};

/**
 * @description Create a address linked to a user.
 * @param req header: token, body: address data,
 */
export const createAddress = async (req: Request, res: Response) => {
    // Get data from request
    const token = req.headers.authorization.split(" ");
    const body = req.body as AddressDto;
    const auth = await Auth(token[1]);

    // Validate
    if (!auth.auth) {
        return res.status(auth.status).json({
            error: "1",
            massage: auth.message,
        });
    }

    try {
        // Create new address and save it to the database
        const addressRepository = getManager().getRepository(Address);

        const address = new Address();
        address.city = body.city;
        address.addressLine = body.addressLine;
        address.postalCode = body.postalCode;
        address.user = auth.user;

        await addressRepository.save(address);

        return res.status(200).json({
            success: "1",
            massage: "Address added.",
            addressId: address.id,
        });
    } catch (error) {
        return res.status(400).json({
            error: "1",
            massage: "Unvalid request!",
        });
    }
};

/**
 * @description Update address linked to a user.
 * @param req header: token, body: address data,
 */
export const updateAddress = async (req: Request, res: Response) => {
    // Get data from request
    const token = req.headers.authorization.split(" ");
    const body = req.body as AddressDto;
    const auth = await Auth(token[1]);

    // Validate
    if (!auth.auth) {
        return res.status(auth.status).json({
            error: "1",
            massage: auth.message,
        });
    }

    try {
        // Get the address and update it with new values
        const addressRepository = getManager().getRepository(Address);
        const address = await addressRepository.findOne({
            id: Number(body.id),
            user: auth.user,
            isActive: true,
        });

        address.city = body.city;
        address.addressLine = body.addressLine;
        address.postalCode = body.postalCode;

        await addressRepository.save(address);

        return res.status(200).json({
            success: "1",
            massage: "Address updated.",
            addressId: address.id,
        });
    } catch (error) {
        return res.status(404).json({
            error: "1",
            massage: "Unvalid request!",
        });
    }
};

/**
 * @description Delete address (meke it active = 0)
 * @param req header: token, body: address_id
 */
export const deleteAddress = async (req: Request, res: Response) => {
    // Get data from request
    const token = req.headers.authorization.split(" ");
    const body = req.body;
    const auth = await Auth(token[1]);

    // Validate
    if (!auth.auth) {
        return res.status(auth.status).json({
            error: "1",
            massage: auth.message,
        });
    }

    try {
        // Get the address and update it with new values
        const addressRepository = getManager().getRepository(Address);
        const address = await addressRepository.findOne({
            id: Number(body.id),
            user: auth.user,
            isActive: true,
        });

        address.isActive = false;
        await addressRepository.save(address);

        return res.status(200).json({
            success: "1",
            massage: `Address with id ${address.id} deleted.`,
        });
    } catch (error) {
        return res.status(404).json({
            error: "1",
            massage: "Unvalid request!",
        });
    }
};
