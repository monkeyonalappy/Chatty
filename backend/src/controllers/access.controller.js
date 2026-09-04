import crypto from "crypto";

const ACCESS_COOKIE = "site_access";
const ACCESS_DURATION = 30 * 24 * 60 * 60 * 1000;

const getAccessToken = () => {
    const password = process.env.APP_ACCESS_PASSWORD;
    if (!password) throw new Error("APP_ACCESS_PASSWORD is not configured");

    return crypto.createHash("sha256").update(password).digest("hex");
};

export const accessStatus = (req, res) => {
    try {
        res.status(200).json({ unlocked: req.cookies[ACCESS_COOKIE] === getAccessToken() });
    } catch (error) {
        console.error("Error checking site access:", error.message);
        res.status(500).json({ message: "Site access is not configured" });
    }
};

export const unlockSite = (req, res) => {
    const { password } = req.body;

    try {
        const expectedToken = getAccessToken();
        const suppliedToken = crypto.createHash("sha256").update(password || "").digest("hex");
        const isCorrect = crypto.timingSafeEqual(
            Buffer.from(suppliedToken),
            Buffer.from(expectedToken),
        );

        if (!isCorrect) return res.status(401).json({ message: "Incorrect access password" });

        res.cookie(ACCESS_COOKIE, expectedToken, {
            maxAge: ACCESS_DURATION,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
        });
        res.status(200).json({ unlocked: true });
    } catch (error) {
        console.error("Error unlocking site:", error.message);
        res.status(500).json({ message: "Site access is not configured" });
    }
};