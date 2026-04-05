import express from 'express';
import authRoutes from "./routes/auth.js";
import cors from "cors";
import { authenticate } from './middleware/auth.js';
import vehicleRoutes from "./routes/vehicles.js";
import logRoutes from "./routes/logs.js";


const app = express();
const port = 8080;
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173"
}));


app.use("/api/auth", authRoutes) 
app.use("/api/vehicles", authenticate, vehicleRoutes);
app.use("/api/vehicles/:id/logs", authenticate, logRoutes);

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})