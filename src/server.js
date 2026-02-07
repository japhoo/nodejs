import express from "express";
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";
// Import routes
import movieRoutes from "./routes/movieRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";

config();
connectDB();

const app = express();


// Body parsing middlewares
app.use(express.json()); //handles json body
app.use(express.urlencoded({ extended: true })); //handles urlencoded body

// API Routes
app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);
app.use("/watchlist", watchlistRoutes);




// const PORT = 5001;
const PORT = process.env.PORT;
const server = app.listen(PORT || 5001, "0.0.0.0", () => {
    console.log(`App listening on port ${PORT}!.`);
})

// Handle unhandled promise rejections e,g db connection errors
process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejection: ", err);
    server.close(async () => {
        await disconnectDB();
        process.exit(1);
    });

});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
    console.log("Uncaught Exception: ", err);
    await disconnectDB();
    process.exit(1);

});

// Graceful shutdown
process.on("SIGTERM", async () => {
    console.log("SIGTERM received, shutting down gracefully: ");
    server.close(async () => {
        await disconnectDB();
        process.exit(1);
    });

});