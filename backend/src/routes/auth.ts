import { Router } from "express";
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }

        const hashedPassword = await argon2.hash(password);

        const user = await prisma.user.create({
            data: { email, password: hashedPassword, name },
            select: {
                id: true,
                email: true,
                name: true
            }
        });

        return res.status(201).json(user);

    } catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
})

router.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            return res.status(401).json({ error: "email not found" });
        }

        const valid = await argon2.verify(user.password, password);
        if (!valid) {
            return res.status(401).json({ error: "Invalid password" });
        }
        
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        })
    } catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
});

export default router