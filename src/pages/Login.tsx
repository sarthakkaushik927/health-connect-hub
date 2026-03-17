import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import AuthInput from "@/components/AuthInput";
import SpinnerButton from "@/components/SpinnerButton";
import { Shield, CheckCircle2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const signupConfirmed = location.state?.signupConfirmed;
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [shaking, setShaking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const data = await api.login({ email: form.email, password: form.password });
      login(data.token, data.name);
      navigate("/dashboard");
    } catch (err: any) {
      const msg = err.message || "Login failed. Please try again.";
      setApiError(
        msg.toLowerCase().includes("wrong password")
          ? "That password doesn't match our records. Please try again."
          : msg.toLowerCase().includes("not found")
          ? "We couldn't find an account with that email."
          : msg
      );
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
    } finally {
      setLoading(false);
    }
  };

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
  const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={shaking ? { x: [-4, 4, -4, 4, 0] } : { opacity: 1, y: 0 }}
        transition={{ ease: [0.25, 0.1, 0.25, 1], duration: 0.3 }}
        className="auth-card"
      >
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-6 h-6 text-primary" />
          <span className="text-sm font-semibold text-primary tracking-wide uppercase">Secure Portal</span>
        </div>
        <h1 className="text-2xl font-semibold text-foreground">Welcome back</h1>
        <p className="text-muted mt-2 mb-8 text-sm">Sign in to access your health records.</p>

        {signupConfirmed && !apiError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-xl bg-accent border border-primary/20 flex items-start gap-3 text-left"
          >
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Signup confirmed!</p>
              <p className="text-xs text-muted leading-relaxed">Your account is now verified. Please sign in to continue.</p>
            </div>
          </motion.div>
        )}

        {apiError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
          >
            {apiError}
          </motion.div>
        )}

        <motion.form onSubmit={handleSubmit} variants={stagger} initial="hidden" animate="show" className="space-y-4">
          <motion.div variants={item}>
            <AuthInput label="Email Address" type="email" placeholder="john@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
          </motion.div>
          <motion.div variants={item}>
            <AuthInput label="Password" type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} />
          </motion.div>
          <motion.div variants={item} className="pt-2">
            <SpinnerButton type="submit" loading={loading}>Access Records</SpinnerButton>
          </motion.div>
        </motion.form>

        <p className="mt-6 text-center text-sm text-muted">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary font-medium hover:underline">Create one</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
