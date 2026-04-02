import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Building2, Mail, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const API_BASE = import.meta.env.VITE_API_URL;

interface LoginProps {
  onLogin: (role: "user" | "officer" | "admin") => void;
  onBackToLanding: () => void;
  onGoToSignup: () => void;
}

export function Login({ onLogin, onBackToLanding, onGoToSignup }: LoginProps) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "officer" | "admin">("user");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: identifier.includes("@") ? identifier : undefined,
          mobile: identifier.includes("@") ? undefined : identifier,
          password,
        }),
      });

      if (!response.ok) {
        const msg = await response.text();
        alert(msg);
        return;
      }

      const user = await response.json();

      const backendRole = user.role.toLowerCase();

      if (backendRole !== role) {
        alert(
          `Role mismatch.\nYou selected "${role}", but your account is "${backendRole}".`
        );
        return;
      }

      // store user
      localStorage.setItem("user", JSON.stringify(user));

      // proceed only if role matches
      onLogin(backendRole);

    } catch (error) {
      console.error("Login error:", error);
      alert("Server error. Please try again.");
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Button onClick={onBackToLanding} variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card className="p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
              <Building2 className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl mb-2">Welcome Back</h2>
            <p className="text-muted-foreground">
              Login to access your welfare benefits
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role selector kept for UI, but NOT trusted */}
            <div>
              <Label htmlFor="role">Login As *</Label>
              <Select value={role} onValueChange={(value: any) => setRole(value)}>
                <SelectTrigger id="role" className="mt-2 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User (Citizen)</SelectItem>
                  <SelectItem value="officer">Officer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="identifier">Email or Phone *</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="identifier"
                  type="text"
                  placeholder="Enter your email or phone"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password *</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 pr-20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full bg-accent  ">
              Login
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button
                onClick={onGoToSignup}
                variant="link"
                className="p-0 text-primary"
              >
                Sign Up
              </Button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
