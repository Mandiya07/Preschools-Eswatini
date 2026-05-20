import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail } from "lucide-react";
import { SEO } from "@/components/SEO";

export function SignUpPage() {
  const { register, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await register(formData.email, formData.password, formData.name);
      setSuccess(true);
    } catch (err: any) {
      console.error("Registration failed:", err);
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center max-w-md w-full">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Verify Your Email</h1>
          <p className="text-slate-600 mb-6">
            We've sent a verification link to <strong>{formData.email}</strong>. 
            Please check your inbox and click the link to activate your account.
          </p>
          <Button asChild className="w-full bg-blue-600">
            <Link to="/login">Proceed to Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4 py-12">
      <SEO title="Sign Up | Sikolo Platform" />
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2 text-center">Create Account</h1>
        <p className="text-slate-600 mb-8 text-center text-sm">Join the ecosystem and start exploring.</p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" required value={formData.email} onChange={handleChange} placeholder="name@example.com" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" />
          </div>
          
          <Button type="submit" disabled={loading || authLoading} className="w-full bg-blue-600 h-11">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign Up"}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-500 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
