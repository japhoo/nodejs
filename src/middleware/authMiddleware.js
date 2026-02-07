import { prisma } from "../config/db.js";
import jwt from 'jsonwebtoken';
export const authMiddleware = async (req, res, next) => {
    // console.log("Auth middleware reached");
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return res.status(401).json({
            status: "error",
            message: "Not authorized, no token provided",
            message_: "Authorization failed",
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRETE);

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id
            }
        });

        if (!user) {
            return res.status(401).json({
                status: "error",
                message: `User no longer exist`,
            });
        }

        req.user = user
        next();

    } catch (error) {
        return res.status(401).json({
            status: "error",
            message: `Authorization failed error: ${error.message}`,
        });
    }

}