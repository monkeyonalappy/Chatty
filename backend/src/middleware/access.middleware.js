import crypto from "crypto";

const ACCESS_COOKIE = "site_access";

export const requireSiteAccess = (req, res, next) => {
    const password = process.env.APP_ACCESS_PASSWORD;
    const expectedToken = password
        ? crypto.createHash("sha256").update(password).digest("hex")
        : null;

    if (expectedToken && req.cookies[ACCESS_COOKIE] === expectedToken) return next();

    res.status(403).json({ message: "Unlock the site before creating an account" });
};