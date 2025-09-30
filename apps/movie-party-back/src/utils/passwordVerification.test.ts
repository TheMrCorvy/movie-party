import { hashPassword, verifyPassword } from "./passwordVerification";

describe("Password Hashing and Verification", () => {
    const plainPassword = "MySecurePassword123!";

    it("should hash a password and produce a different hash each time", async () => {
        const hashedPassword1 = await hashPassword(plainPassword);
        const hashedPassword2 = await hashPassword(plainPassword);

        expect(hashedPassword1).not.toBe(plainPassword);
        expect(hashedPassword2).not.toBe(plainPassword);
        expect(hashedPassword1).not.toBe(hashedPassword2);
    });

    it("should verify a correct password", async () => {
        const hashedPassword = await hashPassword(plainPassword);
        const isCorrect = await verifyPassword(plainPassword, hashedPassword);

        expect(isCorrect).toBe(true);
    });

    it("should reject an incorrect password", async () => {
        const hashedPassword = await hashPassword(plainPassword);
        const wrongPassword = "WrongPassword456";
        const isCorrect = await verifyPassword(wrongPassword, hashedPassword);

        expect(isCorrect).toBe(false);
    });

    it("should verify the same password against different hashes", async () => {
        const hashedPassword1 = await hashPassword(plainPassword);
        const hashedPassword2 = await hashPassword(plainPassword);

        const isCorrect1 = await verifyPassword(plainPassword, hashedPassword1);
        const isCorrect2 = await verifyPassword(plainPassword, hashedPassword2);

        expect(isCorrect1).toBe(true);
        expect(isCorrect2).toBe(true);
    });
});
