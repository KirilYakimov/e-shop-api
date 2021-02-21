import * as bcrypt from "bcrypt";

/**
 * @param password  [password].
 * @return String The hashed password.
 */
export const hashPassword = async (password: string) => {
    // Hash the user password
    const saltRounds = await bcrypt.genSalt(10);
    return bcrypt.hashSync(password, saltRounds);
};

/**
 * @param password  [password].
 * @return Bool checks if the password maches.
 */
export const comparePassword = async (reqPassword: string, dbPassword: string) => {
    return await bcrypt.compare(reqPassword, dbPassword);
};
