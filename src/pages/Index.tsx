import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, ArrowRight, Lock, Smartphone, FileCheck } from "lucide-react";
import SpinnerButton from "@/components/SpinnerButton";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Lock, title: "End-to-end Encryption", desc: "Your data is protected with military-grade security." },
    { icon: Smartphone, title: "Two-factor Auth", desc: "Phone verification adds an extra layer of protection." },
    { icon: FileCheck, title: "Secure Records", desc: "Access your medical history anytime, anywhere." },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">HealthConnect Hub</span>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="text-sm font-medium text-primary hover:underline"
          >
            Sign in
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: [0.25, 0.1, 0.25, 1], duration: 0.4 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-8">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-semibold text-foreground leading-tight">
              Your health data, secured.
            </h1>
            <p className="text-muted mt-4 text-lg max-w-md mx-auto">
              Access your medical records, appointments, and prescriptions — all in one secure portal.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <SpinnerButton onClick={() => navigate("/signup")} className="sm:w-auto px-8">
                Start Secure Registration <ArrowRight className="w-4 h-4 ml-1" />
              </SpinnerButton>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20"
          >
            {features.map((f) => (
              <div key={f.title} className="text-center">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mx-auto mb-3">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">{f.title}</h3>
                <p className="text-xs text-muted mt-1">{f.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Index;
