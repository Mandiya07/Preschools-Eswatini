import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, AlertCircle } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Logo } from "@/components/layout/Logo";

export function LoginPage() {
  const { login, loginWithEmail, user, loading, sendEmailVerification, devLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      if (!user.emailVerified) {
        // Stay on login page if not verified, show verification status
        return;
      }
      if (user.role === 'SuperAdmin') navigate('/super');
      else if (user.role === 'SchoolAdmin') navigate('/admin');
      else if (user.role === 'Supplier') navigate('/supplier');
      else if (user.role === 'Advertiser') navigate('/advertiser');
      else navigate('/parent');
    }
  }, [user, loading, navigate]);

  const handleGoogleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error("Login failed:", error);
      if (error && error.code === "auth/unauthorized-domain") {
        setError("This domain is not authorized in Firebase. Please go to your Firebase Console > Authentication > Settings > Authorized Domains and add this domain.");
      } else {
        setError(error.message || "Failed to sign in with Google");
      }
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLocalLoading(true);
    try {
      await loginWithEmail(email, password);
    } catch (err: any) {
      console.error("Email login failed:", err);
      setError(err.message || "Invalid email or password");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      await sendEmailVerification();
      setVerificationSent(true);
    } catch (err) {
      console.error("Failed to resend verification", err);
    }
  };

  if (user && !user.emailVerified) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center max-w-md w-full">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Verification Required</h1>
          <p className="text-slate-600 mb-6">
             Your email address <strong>{user.email}</strong> is not yet verified. 
             Please check your inbox for the verification link.
          </p>
          
          {verificationSent ? (
            <div className="bg-green-50 text-green-600 p-3 rounded-xl text-sm mb-6 font-medium">
              Verification email has been resent!
            </div>
          ) : (
            <Button onClick={handleResendVerification} className="w-full mb-3" variant="outline">
              Resend Verification Email
            </Button>
          )}
          
          <Button variant="ghost" className="w-full text-slate-500" onClick={() => window.location.reload()}>
            I've verified my email
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4 py-12">
      <SEO title="Sign In | Preschools Eswatini Platform" />
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-md w-full flex flex-col">
        <div className="flex flex-col items-center justify-center mb-8 border-b border-slate-100 pb-6">
          <Link to="/">
            <Logo variant="full" size="lg" className="hover:opacity-90 transition-opacity" />
          </Link>
        </div>
        <h1 className="text-xl font-bold mb-2 text-center text-slate-800">Sign In</h1>
        <p className="text-slate-500 mb-6 text-center text-xs">Welcome back. Please enter your credentials to access your dashboard.</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="name@example.com" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
            />
          </div>
          
          <Button type="submit" disabled={loading || localLoading} className="w-full bg-blue-600 h-11">
            {localLoading || loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
          </Button>
        </form>

        <div className="relative my-8 text-center">
           <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200"></span>
           </div>
           <span className="relative bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Or continue with</span>
        </div>

        <Button onClick={handleGoogleLogin} disabled={loading || localLoading} variant="outline" className="w-full h-11 border-slate-200 hover:bg-slate-50 font-bold">
           <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-4 w-4 mr-2" />
           Google
        </Button>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-500 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-bold hover:underline">
              Create an Account
            </Link>
          </p>
          {devLogin && (
            <div className="mt-4">
               <Button onClick={() => devLogin('SuperAdmin')} variant="outline" className="w-full text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100">
                  Dev: Sign in as Super Admin
               </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
