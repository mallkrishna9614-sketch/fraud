"use client";

import { motion } from "framer-motion";

type MetricCardProps = {
  label: string;
  value: number;
  accent?: "blue" | "red";
};

export function MetricCard({ label, value, accent = "blue" }: MetricCardProps) {
  const colorClass = accent === "red" ? "shadow-glowRed border-neonRed/40" : "shadow-glowBlue border-neonBlue/40";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`rounded-2xl border bg-panel p-4 backdrop-blur-md ${colorClass}`}
    >
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <motion.p
        key={value}
        initial={{ opacity: 0.4, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="mt-2 text-3xl font-semibold text-slate-100"
      >
        {value.toLocaleString()}
      </motion.p>
    </motion.div>
  );
}
