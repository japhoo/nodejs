import jwt from 'jsonwebtoken';
// import 'dotenv/config';

export const generateToken = (userId, res) => {
    const payload = { id: userId };
    const token = jwt.sign(payload, process.env.JWT_SECRETE, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d"
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: (100 * 60 * 60 * 24) * 7 //7days in ms
    })
    return token;
}