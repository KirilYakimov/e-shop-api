import { v4 as uuid } from "uuid";
import * as jwt from "jsonwebtoken";
import { getManager } from "typeorm";

import User from "../entity/User";
import RefreshToken from "../entity/RefreshToken";

export const generateTokenAndRefreshToken = async (user: User) => {
    const payload = {
        id: user.id,
        firstName: user.firstName,
    };

    try {
        const jwtId = uuid();

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 300, // 5 mins
            jwtid: jwtId,
            subject: user.id.toString(),
        });

        const refreshToken = await generateRefreshToken(user, jwtId);

        return { token, refreshToken };
    } catch (e) {
        console.log("Can't create token! ", e);
        return e;
    }
};

const generateRefreshToken = async (user: User, jwtId: string) => {
    // Get the list first
    const refreshTokenRepository = getManager().getRepository(RefreshToken);

    // Set expiry days \
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 10);

    // Create new refresh token
    const refreshToken = new RefreshToken();
    refreshToken.user = user;
    refreshToken.jwtId = jwtId;
    refreshToken.expiryDate = expiryDate;
    refreshToken.isActive = true;

    await refreshTokenRepository.save(refreshToken);

    return refreshToken.id;
};

export const Auth = async (token: string, refreshTokenId: string = undefined) => {
    try {
        // Check if the token when refreshTokenId is  is valid 
        if (!refreshTokenId && !isTokenValid(token)) {
            throw "Token not valid!";
        }

        // refreshToken id form token
        const jwtId = fetchJwtId(token);
        console.log(jwtId);
        console.log(refreshTokenId);
        // Get and validate if the user exist
        const user: User = await User.fetchUserFromToken(token);
        if (!user) {
            throw "User dose not exist!";
        }

        // Fetch to refresh token
        const refreshTokenRepository = getManager().getRepository(RefreshToken);

        const refreshToken = await refreshTokenRepository.findOne(
            refreshTokenId ? { id: refreshTokenId } : { jwtId: jwtId }
        );

        if (!refreshToken) {
            throw "Refresh token does not exist!";
        }

        // Check if the refresh token is active
        if (!refreshToken.isActive) {
            throw "Refresh token is not active!";
        }

        // Check if the refresh token is likend to the token
        if (refreshToken.jwtId != jwtId) {
            throw "Refresh token is not linked to the token!";
        }

        // Is the refresh token expired
        if (!isRefreshTokenExpired(refreshToken)) {
            refreshToken.isActive = false;
            refreshTokenRepository.save(refreshToken);

            throw "Refresh token is expired!";
        }

        return { auth: true, status: 200, user: user };
    } catch (error) {
        return { auth: false, status: 401, message: error };
    }
};

export const isTokenValid = (token: string) => {
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        return true;
    } catch (error) {
        return false;
    }
};

export const isRefreshTokenExpired = (refreshToken: RefreshToken) => {
    const refreshTokenExpiringDate = new Date(refreshToken.expiryDate);
    const now = new Date();

    return now < refreshTokenExpiringDate ? true : false;
};

export const fetchJwtId = (token: string) => {
    const tokenDecoded = jwt.decode(token);
    return tokenDecoded["jti"];
};

export const getNewRefreshToken = (refreshTokenExpiringDate: Date) => {
    const dateNow = new Date();
    dateNow.setDate(dateNow.getDate() + 2);
    dateNow.setHours(23);
    dateNow.setMinutes(59);
    dateNow.setSeconds(59);

    return dateNow > refreshTokenExpiringDate ? true : false;
};
