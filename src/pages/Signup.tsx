import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import AuthInput from "@/components/AuthInput";
import SpinnerButton from "@/components/SpinnerButton";
import { Shield } from "lucide-react";

const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
});

const Signup = () => {
  const navigate = useNavigate();
  const { setPhone } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    const result = signupSchema.safeParse(form);
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
      await api.signup({
        name: form.name,
        email: form.email,
        phone: Number(form.phone),
        password: form.password,
      });
      localStorage.setItem("auth_name", form.name);
      setPhone(Number(form.phone));
      // Send OTP automatically
      try {
        await api.sendOtp({ phone: Number(form.phone) });
      } catch {}
      navigate("/verify-otp");
    } catch (err: any) {
      setApiError(err.message || "Registration failed. Please try again.");
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
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: [0.25, 0.1, 0.25, 1], duration: 0.3 }}
        className="auth-card"
      >
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-6 h-6 text-primary" />
          <span className="text-sm font-semibold text-primary tracking-wide uppercase">Secure Portal</span>
        </div>
        <h1 className="text-2xl font-semibold text-foreground">Create Account</h1>
        <p className="text-muted mt-2 mb-8 text-sm">Enter your details to secure your health records.</p>

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
            <AuthInput label="Full Name" placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
          </motion.div>
          <motion.div variants={item}>
            <AuthInput label="Email Address" type="email" placeholder="john@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
          </motion.div>
          <motion.div variants={item}>
            <AuthInput label="Phone Number" type="tel" placeholder="1234567890" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} error={errors.phone} />
          </motion.div>
          <motion.div variants={item}>
            <AuthInput label="Password" type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} />
          </motion.div>
          <motion.div variants={item} className="pt-2">
            <SpinnerButton type="submit" loading={loading}>Create Account</SpinnerButton>
          </motion.div>
        </motion.form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
