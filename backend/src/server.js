import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import chatRoutes from "./routes/chatRoute.js";
import speechRoutes from "./routes/speechRoute.js"
import paymentRoutes from "./routes/paymentRoutes.js";

import { connectDB } from "./lib/db.js";

const app = express();
const PORT  = process.env.PORT || 5001;


const __dirname  = path.resolve();

const allowedOrigins = [
  "http://localhost:5777",                         // Local dev
  "https://convofy-s2kg.onrender.com"         // Render static frontend
];

app.use(cookieParser());
app.use(cors({
    origin:allowedOrigins,
    credentials:true // Allow the frontend to send cookies
}))

//using this before using express.json because stripe require raw data
app.use("/api/payment",paymentRoutes);

app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/speech", speechRoutes);


// if(process.env.NODE_ENV === "production") {
//     app.use(express.static(path.join(__dirname, "../frontend/dist")));

//     app.get("*", (req,res)=>{
//         res.sendFile(path.join(__dirname,"../frontend" , "dist" , "index.html"));
//     })
// }

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});