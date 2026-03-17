import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import OtpInput from "@/components/OtpInput";
import SpinnerButton from "@/components/SpinnerButton";
import { ShieldCheck, ArrowLeft } from "lucide-react";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const { userPhone, setVerified } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);

  const phone = userPhone || 0;
  const maskedPhone = String(phone).length >= 4
    ? `(•••) •••-${String(phone).slice(-4)}`
    : String(phone);

  const handleVerify = async (otp: string) => {
    setError("");
    setLoading(true);
    try {
      await api.verifyOtp({ phone, otp: Number(otp) });
      setSuccess(true);
      setTimeout(() => navigate("/login", { state: { signupConfirmed: true } }), 1200);
    } catch (err: any) {
      setError(err.message?.toLowerCase().includes("invalid") ? "That code is incorrect. Please check and try again." : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    try {
      await api.sendOtp({ phone });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  if (!phone) {
    navigate("/signup");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="fixed inset-0 backdrop-blur-sm bg-background/80" />
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ ease: [0.25, 0.1, 0.25, 1], duration: 0.3 }}
        className="auth-card relative z-10 text-center"
      >
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Identity Verified</h2>
              <p className="text-sm text-muted">Redirecting to your dashboard...</p>
            </motion.div>
          ) : (
            <motion.div key="form" exit={{ opacity: 0 }}>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-2xl font-semibold text-foreground">Verify Identity</h1>
              <p className="text-sm text-muted mt-2 mb-8">
                We've sent a 6-digit code to {maskedPhone}
              </p>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-6 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
                >
                  {error}
                </motion.div>
              )}

              <OtpInput onComplete={handleVerify} error={!!error} success={success} />

              <div className="mt-8">
                <SpinnerButton loading={loading} onClick={() => {}} disabled>
                  {loading ? "Verifying..." : "Enter code above"}
                </SpinnerButton>
              </div>

              <button
                onClick={handleResend}
                disabled={resending}
                className="mt-4 text-sm text-primary font-medium hover:underline disabled:opacity-50"
              >
                {resending ? "Sending..." : "Resend Code"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default VerifyOtp;
