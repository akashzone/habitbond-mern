import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import { Shield } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

const SignupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await apiFetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });

      // Automatically log the user in
      const loginData = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (loginData && loginData.token) {
        localStorage.setItem("token", loginData.token);
        if (loginData.user && loginData.user.id) {
          localStorage.setItem("userId", loginData.user.id);
        }
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f12] text-white flex flex-col items-center justify-between p-6">
      <div className="w-full max-w-md mt-auto mb-auto">
        <div className="flex justify-center items-center mb-8 gap-2 font-bold text-2xl">
          <Shield className="text-indigo-500" size={32} />
          HabitBond
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          <h1 className="text-2xl font-bold mb-2 text-center">Create Account</h1>
          <p className="text-white/60 mb-8 text-center text-sm">
            Start tracking with your habit partner
          </p>

          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-1.5 font-medium">Full Name</label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white placeholder-white/30 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                placeholder="Akash Nadar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-1.5 font-medium">Email Address</label>
              <input
                type="email"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white placeholder-white/30 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-1.5 font-medium">Password</label>
              <input
                type="password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white placeholder-white/30 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 mt-2 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 transition-all shadow-[0_5px_20px_rgba(99,102,241,0.4)] disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-white/40 text-sm">OR</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const res = await fetch("http://localhost:5000/api/auth/google", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                      token: credentialResponse.credential
                    })
                  });

                  const data = await res.json();
                  
                  if (data.token) {
                    localStorage.setItem("token", data.token);
                    if (data.user && data.user._id) {
                      localStorage.setItem("userId", data.user._id);
                    }
                    navigate("/");
                  } else {
                    setError("Google signup failed");
                  }
                } catch (err) {
                  console.error("Google signup failed", err);
                  setError("Google signup failed");
                }
              }}
              onError={() => {
                console.log("Signup Failed");
                setError("Google signup failed");
              }}
              useOneTap
              theme="filled_black"
              shape="pill"
              text="signup_with"
            />
          </div>

          <div className="mt-6 text-center text-sm text-white/40">
            Already have an habitbond account?{" "}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Log in
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-white/40 w-full">
        &copy; {new Date().getFullYear()} HabitBond. All rights reserved.
      </footer>
    </div>
  );
};

export default SignupPage;
