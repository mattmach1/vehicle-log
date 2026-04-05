import { Router } from "express";
import type { Response } from "express";
import { prisma } from "../lib/prisma.js";
import type { AuthRequest } from "../middleware/auth.js";

const router = Router({ mergeParams: true});

router.get("/", async (req: AuthRequest, res: Response) => {
    try {
        if (typeof req.params.id !== 'string') {
            return res.status(400).json({ error: "Invalid vehicle ID" })
        }
        const vehicleId = parseInt(req.params.id)

        if (isNaN(vehicleId)) {
            return res.status(400).json({ error: "Vehicle ID is not a number"})
        }

        const logs = await prisma.maintenanceLog.findMany({
            where: { vehicleId },
            orderBy: {date: "desc" }
        });

        return res.status(200).json(logs)
    } catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
});

router.post("/", async (req: AuthRequest, res: Response) => {
    try {
        if (typeof req.params.id !== 'string') {
            return res.status(400).json({ error: "Invalid vehicle ID" })
        }
        const vehicleId = parseInt(req.params.id)

        if (isNaN(vehicleId)) {
            return res.status(400).json({ error: "Vehicle ID is not a number"})
        }

        const { description, date, notes, expense, mileage } = req.body;

        const log = await prisma.maintenanceLog.create({
            data: {
                description,
                date: new Date(date),
                notes,
                expense,
                mileage,
                vehicleId
            }
        });

        return res.status(201).json(log);
    } catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
});

export default router

