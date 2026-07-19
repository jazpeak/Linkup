import mongoose from "mongoose";
import "dotenv/config";

console.log("Attempting to connect to MongoDB...");
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("SUCCESS: Your MongoDB cluster is ONLINE and reachable!");
        process.exit(0);
    })
    .catch(err => {
        console.error("FAILED: Could not connect to MongoDB.");
        console.error("Error details:", err.message);
        process.exit(1);
    });
