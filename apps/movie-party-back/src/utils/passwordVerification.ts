import bcrypt from "bcrypt";

/**
 * Hashes a plain text password using bcrypt
 * @param password - The plain text password to hash
 * @returns A promise that resolves to the hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
    // Number of salt rounds (10 is a good default, higher = more secure but slower)
    const saltRounds = 10;

    // Generate salt and hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return hashedPassword;
};

/**
 * Verifies a plain text password against a hashed password
 * @param password - The plain text password to verify
 * @param hashedPassword - The hashed password to compare against
 * @returns A promise that resolves to true if the password matches, false otherwise
 */
export const verifyPassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    // Compare the plain text password with the hashed password
    const passIsCorrect = await bcrypt.compare(password, hashedPassword);

    return passIsCorrect;
};
