import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    userId?: number;
}

interface JwtPayload {
    userId: number;
}

// Verify that the Jwt payload is valid
function isJwtPayload(payload: unknown): payload is JwtPayload {
    return typeof payload === "object" && payload !== null && "userId" in payload;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({ error: "Invalid token" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

        if (!isJwtPayload(decoded)) {
            return res.status(401).json({ error: "Invalid token" })
        }

        req.userId = decoded.userId;
        next()
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" })
    }
}