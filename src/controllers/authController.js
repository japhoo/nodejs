import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";


const register = async (req, res) => {
    // return res.json({
    //     message: "hi",
    //     body: req.body
    // });
    const { name, email, password } = req.body;
    let message = "";
    let status = "";
    // check if user exists
    const userExists = await prisma.user.findUnique({
        where: { email: email }
    });
    if (userExists) {
        return res.status(400).json({
            error: "User already exists with this email"
        });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        }
    });

    // Generate JWT token
    const token = generateToken(user.id, res);
    res.status(201).json({
        status: "success",
        message: "message",
        data: {
            user: {
                id: user.id,
                name: name,
                email: email,
            },
            token: token
        }
    });
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        return res.status(401).json({
            error: "Invalid Email or Password"
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({
            error: "Invalid Email or Password"
        });
    }

    // Generate JWT token
    const token = generateToken(user.id, res);
    res.status(200).json({
        status: "success",
        message: "Login successful",
        data: {
            user: {
                id: user.id,
                email: email,
            },
            token: token
        }
    });
}

const logout = async (req, res) => {
    res.cookie("jwt","",{
        httpOnly:true,
        expires: new Date(0),
    })
    res.status(200).json({
        status: "success",
        message: "Logged out successfully",
    });
}



export { register, login, logout };