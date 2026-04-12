import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function Register() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault()
        try {
            const res = await api.post("/auth/register", { name, email, password })
            localStorage.setItem("token", res.data.token)
            navigate("/login")
        } catch (error) {
            setError("Something went wrong")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>
                        Enter your email, name and password below to create an account
                    </CardDescription>
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
                                type="text"
                                placeholder="Email"
                                value={name}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Password"
                                value={email}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && <p className="text-sm text-destructive">{error}</p>}
                        <Button type="submit">Register</Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p>Already have an account? <a href="/login" className="underline">Login</a></p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Register