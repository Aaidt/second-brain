import "../index.css";
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { SquareChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function Auth() { 
   const [loading, setLoading] = useState(false);
   const [email, setEmail] = useState("");
   const [session, setSession] = useState<Session | null>(null);

   const params = new URLSearchParams(window.location.search);
   const hasTokenHash = params.get("token_hash");

   const [verifying, setVerifying] = useState(!!hasTokenHash);
   const [authError, setAuthError] = useState("");
   const [authSuccess, setAuthSuccess] = useState(false);

   useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const token_hash = params.get("token_hash");
      const type = params.get("type");

      if (token_hash) {
         setVerifying(true);
         supabase.auth.verifyOtp({
            token_hash,
            // @ts-expect-error: string is valid
            type: type || "email",
         }).then(({ error }) => {
            if (error) {
               setAuthError(error.message);
            } else {
               setAuthSuccess(true);
               window.history.replaceState({}, document.title, "/");
            }
            setVerifying(false);
         });
      }

      supabase.auth.getSession().then(({ data: { session } }) => {
         setSession(session);
      });

      const {
         data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
         setSession(session);
      });

      return () => subscription.unsubscribe();
   }, []);

   const handleGoogleLogin = async () => {
      const { error } = await supabase.auth.signInWithOAuth({
         provider: "google",
         options: {
            redirectTo: window.location.origin,
         },
      });

      if (error) {
         setAuthError(error.message);
      }
   };


   const handleLogin = async (event: React.FormEvent) => {
      event.preventDefault();
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
         email,
         options: {
            emailRedirectTo: window.location.origin,
         }
      });
      if (error) {
         alert(error.message);
      } else {
         alert("Check your email for the login link!");
      }
      setLoading(false);
   };

   const handleLogout = async () => {
      await supabase.auth.signOut();
      setSession(null);
   };

   const renderContent = () => {
      if (verifying) {
         return (
            <div className="text-center">
               <h1 className="text-2xl font-semibold text-white mb-2">Confirming your magic link...</h1>
               <p className="text-green-400">Loading...</p>
            </div>
         );
      }

      if (authError) {
         return (
            <div className="text-center">
               <h1 className="text-2xl font-semibold text-red-500 mb-2">Authentication failed</h1>
               <p className="text-gray-400 mb-4">{authError}</p>
               <button
                  onClick={() => {
                     setAuthError("");
                     window.history.replaceState({}, document.title, "/");
                  }}
                  className="bg-green-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
               >
                  Return to login
               </button>
            </div>
         );
      }

      if (authSuccess && !session) {
         return (
            <div className="text-center">
               <h1 className="text-2xl font-semibold text-green-500 mb-2">Authentication successful!</h1>
               <p className="text-gray-400">Loading your account...</p>
            </div>
         );
      }

      if (session) {
         return (
            <div className="text-center">
               <h1 className="text-3xl font-bold text-white mb-4">Welcome!</h1>
               <p className="text-green-400 mb-6">You are logged in as: <br /> <span className="font-semibold">{session.user.email}</span></p>
               <button
                  onClick={handleLogout}
                  className="cursor-pointer bg-green-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 transition-transform duration-300 ease-in-out transform hover:scale-105"
               >
                  Sign Out
               </button>
            </div>
         );
      }

      return (
         <>
            <div className="text-center mb-6">
               <h1 className="text-4xl font-bold text-white pb-2">Login</h1>
               <p className="text-gray-400">
                  Sign in via magic link with your email
               </p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
               <input
                  className="border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-3 "
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
               />

               <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-700 text-white text-lg font-bold py-3 rounded-lg cursor-pointer 
                  hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  {loading ? "Sending..." : "Send magic link"}
               </button>

               <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-gray-700" />
                  <span className="text-gray-400 text-sm">OR</span>
                  <div className="flex-1 h-px bg-gray-700" />
               </div>

               <button
                  onClick={handleGoogleLogin}
                  className="flex items-center justify-center gap-3 border border-gray-600 text-white py-3 rounded-lg 
                  hover:bg-gray-800/50 cursor-pointer transition-colors"
               >
                  <img
                     src="https://www.svgrepo.com/show/475656/google-color.svg"
                     alt="Google"
                     className="w-5 h-5"
                  />
                  Continue with Google
               </button>

            </form>
         </>
      );
   }
   const navigate = useNavigate();

   return (
      <div className="min-h-screen bg-black flex justify-center items-center p-4">
         <SquareChevronLeft className="text-white/80 absolute top-4 left-4 cursor-pointer" onClick={() => navigate("/")} />
         <div className="w-full max-w-md p-10 rounded-lg border border-white/30 ">
            {renderContent()}
         </div>
      </div>
   );
}
