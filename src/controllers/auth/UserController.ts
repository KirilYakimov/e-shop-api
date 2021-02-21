import "reflect-metadata";
import { getManager } from "typeorm";
import { validate } from "class-validator";
import { Request, Response } from "express";

import { User } from "../../entity/User";
import {
    Auth,
    generateTokenAndRefreshToken,
} from "../../util/jwt";
import { hashPassword, comparePassword } from "../../util/passwordHash";
import LoginDto from "../../dto/login.dto";
import RegisterDto from "../../dto/register.dto";
import RefreshTokenDto from "../../dto/refreshToken.dto";

/**
 * @description Registers a new user
 * @param req email, password, firstName, lastName
 * @returns token, refresh token, user id and name
 */
export const registerUser = async (req: Request, res: Response) => {
    try {
        // Get body form request
        const body: RegisterDto = req.body;

        // Get the list first
        const userRepository = getManager().getRepository(User);

        // Check if email exists
        const emailExists = await userRepository.findOne({
            email: body.email,
            isActive: true,
        });

        if (emailExists) {
            throw "Email already exists!";
        }

        // Hash the user password
        const hashedPassword = await hashPassword(body.password);

        //Create new user
        const user = new User();
        user.firstName = body.firstName;
        user.lastName = body.lastName;
        user.email = body.email;
        user.password = hashedPassword;
        user.isActive = true;

        //Validate the user data
        const errors = await validate(user);
        if (errors.length > 0) {
            throw errors;
        }

        await userRepository.save(user);

        const userTokenAndRefreshToken = await generateTokenAndRefreshToken(user);

        // return saved shoppingList back
        return res.status(200).json({
            success: "1",
            message: "User created.",
            user: {
                id: user.id,
                firstName: user.firstName,
                token: userTokenAndRefreshToken.token,
                refreshToken: userTokenAndRefreshToken.refreshToken,
            },
        });
    } catch (error) {
        return res.status(401).json({
            error: "1",
            message: "Can't create user! " + error,
        });
    }
};

/**
 * @description logges a user if the credentials are valid
 * @returns user.id, user.firstName, token, refreshToken
 */
export const loginUser = async (req: Request, res: Response) => {
    try {
        // Get body form request
        const body: LoginDto = req.body;

        const userRepository = getManager().getRepository(User);
        const user = await userRepository.findOne({
            email: body.email,
            isActive: true,
        });

        if (!user) {
            throw "Unvalid email!";
        }

        const isPasswordValid = await comparePassword(body.password, user.password);

        if (!isPasswordValid) {
            throw "Unvalid password!";
        }

        const { token, refreshToken } = await generateTokenAndRefreshToken(user);

        return res.json({
            success: "1",
            message: "logged",
            user: {
                id: user.id,
                firstName: user.firstName,
                token: token,
                refreshtoken: refreshToken,
            },
        });
    } catch (error) {
        return res.status(400).json({
            error: "1",
            message: error,
        });
    }
};

/**
 * @description Delete a existing user
 * TODO validate token and make adrass all active false
 */
export const deleteUser = async (req: Request, res: Response) => {
    // TODO is loged/password or admin

    // Get the list first
    const userRepository = getManager().getRepository(User);

    // Get the user
    const user = await userRepository.findOne({
        id: req.body.id,
        isActive: true,
    });

    // change the user to deleted
    user.isActive = false;
    await userRepository.save(user);

    return res.json({
        success: "1",
        message: "User deleted!",
    });
};

/**
 * @description
 * @param req  authKey, password
 */
export const resetUserPassword = async (req: Request, res: Response) => {
    try {
        // TODO 
        
        // Get body form request
        const body = req.body;

        // Get the list first
        const userRepository = getManager().getRepository(User);

        // Check if email exists
        const user = await userRepository.findOne({
            id: req.body.id,
            isActive: true,
        });

        // Hash the user password
        const hashedPassword = await hashPassword(body.password);

        // Change user password
        user.password = hashedPassword;
        await userRepository.save(user);

        return res.status(200).json({
            success: "1",
            message: "Password reset!",
        });
    } catch (error) {
        return res.status(401).json({
            error: "1",
            message: error,
        });
    }
};

/**
 * @description Get's new pair of token and refresh token
 * @param req refreshToken, token
 * @returns token, refreshToken
 */
export const refreshTokenUser = async (req: Request, res: Response) => {
    try {
        // Get body form request
        const body: RefreshTokenDto = req.body;

        // Validate
        const auth = await Auth(body.token, body.refreshToken);
        if (!auth.auth) {
            throw auth.message;
        }

        // Fresh pair of token and refresh token
        const newTokens: RefreshTokenDto = await generateTokenAndRefreshToken(auth.user);

        return res.json({
            success: "1",
            message: "New token and refresh token.",
            user: {
                token: newTokens.token,
                refreshtoken: newTokens.refreshToken,
            },
        });
    } catch (error) {
        return res.status(401).json({
            error: "1",
            message: error,
        });
    }
};
