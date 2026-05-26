import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, Role } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Loader2, Building2 } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function RegisterSupplierPage() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handleRole = async () => {
      if (user && !loading) {
         if (user.role === 'User') {
            setIsRegistering(true);
            try {
               const userDocRef = doc(db, 'users', user.uid);
               await setDoc(userDocRef, { role: 'Supplier' }, { merge: true });
               window.location.href = '/supplier';
            } catch (err) {
               console.error(err);
               setIsRegistering(false);
            }
         } else if (user.role === 'Supplier') {
            navigate('/supplier');
         } else {
            // Already has another role, guide them to their dashboard
            if (user.role === 'SuperAdmin') navigate('/super');
            else if (user.role === 'SchoolAdmin') navigate('/admin');
            else if (user.role === 'Advertiser') navigate('/advertiser');
            else navigate('/parent');
         }
      }
    };
    handleRole();
  }, [user, loading, navigate]);

  const handleLogin = async () => {
    setError(null);
    try {
      await login();
    } catch (err: any) {
      console.error("Login failed:", err);
      if (err && err.code === "auth/unauthorized-domain") {
        setError("This domain is not authorized in Firebase. Please go to your Firebase Console > Authentication > Settings > Authorized Domains and add this domain.");
      } else {
        setError(err.message || "Failed to sign in with Google");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <SEO title="Supplier Registration | Preschools Eswatini Platform" />
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center max-w-md w-full relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5">
          <Building2 className="w-48 h-48 text-blue-900" />
        </div>
        <div className="relative z-10">
           <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Building2 className="h-8 w-8" />
           </div>
           <h1 className="text-3xl font-extrabold mb-4 text-slate-900">Become a Supplier</h1>
           <p className="text-slate-600 mb-8 font-medium">Join our marketplace to sell your educational products and services directly to schools.</p>
           
           {error && (
             <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 text-left">
               {error}
             </div>
           )}

           <Button onClick={handleLogin} disabled={loading || isRegistering} className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg rounded-xl">
              {(loading || isRegistering) ? <Loader2 className="h-6 w-6 animate-spin" /> : "Sign Up with Google"}
           </Button>
           <p className="mt-6 text-sm text-slate-500">
             Already have a supplier account? <button onClick={handleLogin} className="text-blue-600 font-bold hover:underline">Log in</button>
           </p>
        </div>
      </div>
    </div>
  );
}
