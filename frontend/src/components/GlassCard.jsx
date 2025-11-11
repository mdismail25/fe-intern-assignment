import { motion } from "framer-motion";

export default function GlassCard({ children, className = "" }) {
  return (
    <motion.div
      initial={{ y: 8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className={`text-white backdrop-blur-xl bg-black/35 border border-white/15 rounded-2xl shadow-[0_8px_30px_rgba(2,6,23,0.35)] ${className}`}
    >
      {children}
    </motion.div>
  );
}
