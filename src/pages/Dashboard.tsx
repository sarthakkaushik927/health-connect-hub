import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, FileText, Calendar, User, LogOut, Activity, Heart, Pill } from "lucide-react";

const Dashboard = () => {
  const { userName, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const cards = [
    { icon: FileText, title: "Medical Records", desc: "View your health history", color: "text-primary" },
    { icon: Calendar, title: "Appointments", desc: "Schedule & manage visits", color: "text-secondary" },
    { icon: Pill, title: "Prescriptions", desc: "Active medications", color: "text-primary" },
    { icon: Activity, title: "Lab Results", desc: "Recent test results", color: "text-secondary" },
    { icon: Heart, title: "Vitals", desc: "Track your health metrics", color: "text-primary" },
    { icon: User, title: "Profile", desc: "Manage your information", color: "text-secondary" },
  ];

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">HealthPortal</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-semibold text-foreground">
            Welcome{userName ? `, ${userName}` : ""}
          </h1>
          <p className="text-muted mt-2">Your health data, secured.</p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10"
        >
          {cards.map((card) => (
            <motion.div
              key={card.title}
              variants={item}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
              className="p-6 bg-card rounded-2xl cursor-pointer transition-shadow hover:shadow-lg"
              style={{ boxShadow: "var(--card-shadow)" }}
            >
              <card.icon className={`w-8 h-8 ${card.color} mb-4`} />
              <h3 className="font-semibold text-foreground">{card.title}</h3>
              <p className="text-sm text-muted mt-1">{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
