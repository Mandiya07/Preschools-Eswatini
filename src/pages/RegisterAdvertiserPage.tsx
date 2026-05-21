import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, Role } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Loader2, MonitorSmartphone } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function RegisterAdvertiserPage() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = React.useState(false);

  React.useEffect(() => {
    const handleRole = async () => {
      if (user && !loading) {
         if (user.role === 'User') {
            setIsRegistering(true);
            try {
               const userDocRef = doc(db, 'users', user.uid);
               await setDoc(userDocRef, { role: 'Advertiser' }, { merge: true });
               window.location.href = '/advertiser';
            } catch (err) {
               console.error(err);
               setIsRegistering(false);
            }
         } else if (user.role === 'Advertiser') {
            navigate('/advertiser');
         } else {
            // Already has another role, guide them to their dashboard
            if (user.role === 'SuperAdmin') navigate('/super');
            else if (user.role === 'SchoolAdmin') navigate('/admin');
            else if (user.role === 'Supplier') navigate('/supplier');
            else navigate('/parent');
         }
      }
    };
    handleRole();
  }, [user, loading, navigate]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <SEO title="Advertiser Registration | Preschools Eswatini Platform" />
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center max-w-md w-full relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5">
          <MonitorSmartphone className="w-48 h-48 text-purple-900" />
        </div>
        <div className="relative z-10">
           <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MonitorSmartphone className="h-8 w-8" />
           </div>
           <h1 className="text-3xl font-extrabold mb-4 text-slate-900">Become an Advertiser</h1>
           <p className="text-slate-600 mb-8 font-medium">Reach our highly engaged audience of parents, students, and school administrators.</p>
           
           <Button onClick={handleLogin} disabled={loading || isRegistering} className="w-full bg-purple-600 hover:bg-purple-700 h-14 text-lg rounded-xl">
              {(loading || isRegistering) ? <Loader2 className="h-6 w-6 animate-spin" /> : "Sign Up with Google"}
           </Button>
           <p className="mt-6 text-sm text-slate-500">
             Already have an advertiser account? <button onClick={handleLogin} className="text-purple-600 font-bold hover:underline">Log in</button>
           </p>
        </div>
      </div>
    </div>
  );
}
