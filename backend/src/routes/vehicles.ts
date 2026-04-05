import { Router } from "express";
import type { Response } from "express";
import { prisma } from "../lib/prisma.js";
import type { AuthRequest } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req: AuthRequest, res: Response) => {
    try {
        if (!req.userId) {
            return res.status(404).json({ error: "Cannot find user ID" })
        }
        const vehicles = await prisma.vehicle.findMany({
            where: { ownerId: req.userId }
        });

        return res.status(200).json(vehicles);
    } catch (err) {
        return res.status(500).json({ error: "Server error" })
    }
})

router.post("/", async (req: AuthRequest, res: Response) => {
    try {
        const { year, make, model } = req.body;
        
        const newVehicle = await prisma.vehicle.create({
            data: {
                make,
                model,
                year,
                ownerId: req.userId!
            }
        })

        return res.status(201).json(newVehicle)
    } catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
})

export default router;