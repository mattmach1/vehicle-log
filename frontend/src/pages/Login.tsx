import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button"


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate()

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault()
        try {
            const res = await api.post("/auth/login", { email, password })
            localStorage.setItem("token", res.data.token)
            navigate("/dashboard")
        } catch (error) {
            setError("Invalid credentials")
        }
    }

    return (

        <div className="min-h-screen flex items-center justify-center bg-background">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Enter your email below to login to your account</CardDescription>
                    <CardAction>
                        <ModeToggle />
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        <Button type="submit">Login</Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm">Don't have an account? <a href="/register" className="underline">Register</a></p>
                </CardFooter>
            </Card>
        </div>

    )
}

export default Login