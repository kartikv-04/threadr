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

const LoginForm = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
            <Card className="w-full max-w-sm bg-white/5 backdrop-blur-2xl border-white/10 text-white">
                <h1 className="flex justify-center items-center font-mono text-3xl p-4">
                    Welcome back!
                </h1>
                <CardContent>
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input id="password" type="password" required />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <div className="flex gap-4 w-max p-2">
                        <input type="checkbox" name="terms" />
                        <h2>I agree to the <span className="text-purple-500">Terms of Service</span> and <span className="text-purple-500">Privacy Policy</span></h2>
                    </div>
                    <Button type="submit" className="w-full">
                        Login
                    </Button>
                    <p className="p-4">Don't have an account? <a href="" style={{ color: "oklch(43.589% 0.19382 294.483)" }}>Signup</a></p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default LoginForm