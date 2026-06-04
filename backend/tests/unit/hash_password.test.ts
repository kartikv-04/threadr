import { hashPassword } from "../../src/helper/utility.js";
import bcrypt from "bcryptjs";


// Test to check hashPassword
describe("hashPassword", ()=> {
    
    // Check : 1 Check if password is being generated and being verified
    test("Password should be generated and be verified", async () => {

        // Take a random password 
        const password = "Admin@123";

        // Call the function
        const hash = await hashPassword(password);

        // cover every case with match
        // Verify generated password
        const isMatch = await bcrypt.compare(password, hash);
        expect(typeof hash).toBe("string");
        expect(isMatch).toBe(true);

        // Wrong Password should be failed
        const wrongPass = await bcrypt.compare("Anything", hash);
        expect(wrongPass).toBe(false);

    });

    // Check : 2 Check if every hash is diff for same Password
    test("Gives different hash for same password", async () => {
        const password = "Admin@123"
        const hash1 = await hashPassword(password);
        const hash2 = await hashPassword(password);

        expect(hash1).not.toBe(hash2);
    })
})