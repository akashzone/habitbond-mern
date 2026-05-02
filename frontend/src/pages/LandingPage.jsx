import React from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Flame, Users, BellRing, CheckCircle, TrendingUp } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#0d0f12] text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 md:px-16 py-6 border-b border-white/5 bg-white/[0.02] backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
          <Shield className="text-indigo-500" size={28} />
          HabitBond
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition-all"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)]"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 w-100vw flex flex-col items-center justify-center text-center px-6 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0d0f12] to-[#0d0f12] pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/50">
            Build habits with <br className="hidden md:block" /> absolute accountability.
          </h1>
          <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop breaking promises to yourself. Pair up with an accountability partner, track shared streaks, and build life-changing habits together.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/signup")}
              className="px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 transition-all shadow-[0_10px_30px_rgba(99,102,241,0.3)] w-full sm:w-auto"
            >
              Start Your Journey
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-4 rounded-xl text-base font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all w-full sm:w-auto"
            >
              Log In
            </button>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-24 px-6 md:px-16 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why HabitBond works</h2>
            <p className="text-white/50 max-w-xl mx-auto">Our unique system leverages human connection to ensure you never miss a day again.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: "Shared Habits", desc: "Create a private workspace with your partner to track mutual goals." },
              { icon: Flame, title: "Streak Tracking", desc: "Build massive momentum. Watch your shared streaks grow day by day." },
              { icon: Shield, title: "Appeal System", desc: "Missed a day for a valid reason? Submit an appeal for your partner to review." },
              { icon: BellRing, title: "Real-time Sync", desc: "Live dashboard updates utilizing secure WebSockets." }
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-6 border border-indigo-500/30 group-hover:scale-110 transition-transform">
                  <f.icon className="text-indigo-400" size={24} />
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 md:px-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">3 Simple Steps</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-bold text-indigo-400 mb-6">1</div>
              <h4 className="text-xl font-semibold mb-2">Create a Room</h4>
              <p className="text-white/50 text-sm">Sign up and generate a unique secure workspace code.</p>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-bold text-indigo-400 mb-6">2</div>
              <h4 className="text-xl font-semibold mb-2">Invite Partner</h4>
              <p className="text-white/50 text-sm">Have your accountability partner join using your code.</p>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-bold text-indigo-400 mb-6">3</div>
              <h4 className="text-xl font-semibold mb-2">Achieve Goals</h4>
              <p className="text-white/50 text-sm">Check in daily, hold each other to the highest standard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-white/5 bg-white/[0.02]">
        <div className="flex items-center justify-center gap-2 font-bold text-lg mb-4 text-white/80">
          <Shield className="text-indigo-500" size={20} /> HabitBond
        </div>
        <p className="text-sm text-white/40">
          &copy; {new Date().getFullYear()} HabitBond. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
