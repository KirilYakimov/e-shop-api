import { Request, Response } from "express";
import { getManager } from "typeorm";
import { validate } from "class-validator";
import bcrypt = require("bcrypt");
import "reflect-metadata";

import { User } from "../../entity/User";
import { error } from "console";

/**
 * Creates a new user
 */
export async function createUser(req: Request, res: Response) {
    try {
        // Get the list first
        const userRepository = getManager().getRepository(User);

        // Check if email exists
        const emailExists = await userRepository.findOne({
            email: req.body.email,
            isActive: 1,
        });

        if (emailExists) {
            return res.json({
                success: "0",
                message: "Email already exists!",
            });
        }

        // Hash the user password
        const saltRounds = await bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);

        //Create new user
        const user = new User();
        user.name = req.body.name;
        user.email = req.body.email;
        user.password = hashedPassword;
        user.isActive = 1;

        //Validate the user data
        const errors = await validate(user);
        if (errors.length > 0) {
            return res.json({ errors });
        }

        await userRepository.save(user);

        // return saved shoppingList back
        return res.json({
            success: "1",
            message: "User created.",
            user: {
                id: user.id,
                name: user.name,
            },
        });
    } catch (err) {
        return res.json({
            success: "0",
            message: "Can't create user!",
        });
    }
}

export async function loginUser(req: Request, res: Response) {
    const userRepository = getManager().getRepository(User);
    const emailExists = await userRepository.findOne({
        email: req.body.email,
        isActive: 1,
    });

    if (!emailExists) {
        return res.status(400).json("Email doesn't exists!");
    }

    const match = await bcrypt.compare(req.body.password, emailExists.password);

    if (!match) {
        return res.status(400).json("Password dosent match");
    }

    return res.json({
        success: "1",
        message: "logged",
    });
}
