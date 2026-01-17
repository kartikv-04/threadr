'use client'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageSquareMore } from 'lucide-react';
import { useState } from "react";
import { SignupPayload } from "./type";
import { useSignup } from "./hook"

const SignupForm = () => {
    const {mutate} = useSignup();

    const [formData, setFormData] = useState<SignupPayload>({
        username : "",
        name : "",
        email: "",
        password: ""
    });

    function handleInput(e: any) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        console.log("this is fomrData", formData);
    }

    function submitForm (data : SignupPayload){
        console.log("Form Submitted", data);
        mutate(data, {
            onSuccess : (response) => {
                console.log("Repsonse", response);
            },
            onError : (error) => {
                console.error("Error", error);
            }
        });
    }

    function handleSubmit(e:any){
        e.preventDefault();
        submitForm(formData);
    }


    return (
        <div className="flex justify-center items-center min-h-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
            <Card className="w-full max-w-sm bg-white/5 backdrop-blur-2xl border-white/10 text-white">
                <div className="flex justify-center items-center">
                    <MessageSquareMore />
                </div>
                <CardHeader className="text-center">
                    <CardTitle className="font-mono text-2xl">Join the Conversation!</CardTitle>
                    <CardDescription className="text-gray-400">
                        Collaborate in real-time with your team. Create your account today.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Username</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleInput}
                                    placeholder="Username"

                                />
                                <Label htmlFor="email">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleInput}
                                    placeholder="Name"

                                />
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInput}
                                    placeholder="m@example.com"

                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInput}
                                    required />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <h2>I agree to the <span className="text-purple-500">Terms of Service</span> and <span className="text-purple-500">Privacy Policy</span></h2>
                        <Button type="submit" className="w-full bg-linear-to-r from-purple-900 via-purple-800 to-purple-950">
                            Signup
                        </Button>
                        <p className="p-4">Already have an account? <a href="" className="text-purple-600">Login here</a></p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

export default SignupForm