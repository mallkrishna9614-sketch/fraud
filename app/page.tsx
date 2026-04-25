"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden grid-lines px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(58,166,255,0.15),transparent_65%)]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-2xl rounded-3xl border border-neonBlue/30 bg-panel px-8 py-14 text-center shadow-glowBlue backdrop-blur-md"
      >
        <p className="text-xs uppercase tracking-[0.32em] text-neonBlue">Fintech Intelligence</p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-100 md:text-5xl">AI Fraud Detection System</h1>
        <p className="mt-4 text-slate-300">Real-time network-based fraud analysis</p>
        <Link
          href="/dashboard"
          className="mt-8 inline-flex rounded-xl border border-neonBlue/60 bg-neonBlue/10 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-neonBlue transition hover:scale-[1.03] hover:bg-neonBlue/20"
        >
          Enter Dashboard
        </Link>
      </motion.div>
    </main>
  );
}
