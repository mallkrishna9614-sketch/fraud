"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { FraudGraph } from "@/components/FraudGraph";
import { LiveFeed } from "@/components/LiveFeed";
import { MetricCard } from "@/components/MetricCard";
import { RiskChart } from "@/components/RiskChart";
import { TransactionsTable } from "@/components/TransactionsTable";
import { UserDetailPanel } from "@/components/UserDetailPanel";
import { getFraudUsers, getGraphData, getTransactions } from "@/lib/api";
import { FraudUser, GraphResponse, Transaction } from "@/lib/types";

const initialGraphData: GraphResponse = { nodes: [], edges: [] };

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [fraudUsers, setFraudUsers] = useState<FraudUser[]>([]);
  const [graphData, setGraphData] = useState<GraphResponse>(initialGraphData);
  const [selectedUserId, setSelectedUserId] = useState<string>();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      const txData = await getTransactions();
      const usersData = await getFraudUsers(txData);
      const graphResponse = await getGraphData(txData);

      if (!mounted) return;

      setTransactions(txData);
      setFraudUsers(usersData);
      setGraphData(graphResponse);
      setShowAlert(txData.some((tx) => tx.status === "Fraud"));
    };

    loadData();
    const interval = setInterval(loadData, 6000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const selectedUser = useMemo(
    () => fraudUsers.find((user) => user.id === selectedUserId) ?? fraudUsers[0],
    [fraudUsers, selectedUserId]
  );

  const highRiskUsers = useMemo(() => fraudUsers.filter((user) => user.riskScore >= 70).length, [fraudUsers]);

  const metrics = useMemo(() => {
    const totalUsers = new Set(transactions.flatMap((tx) => [tx.sender, tx.receiver])).size;
    const totalTransactions = transactions.length;
    const fraudDetected = transactions.filter((tx) => tx.status === "Fraud").length;

    return { totalUsers, totalTransactions, fraudDetected };
  }, [transactions]);

  return (
    <main className="grid-lines min-h-screen px-5 py-6 md:px-8">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-5">
        <header className="flex items-center justify-between rounded-2xl border border-slate-700/60 bg-panel px-4 py-3 backdrop-blur-md">
          <div>
            <h1 className="text-xl font-semibold text-slate-100 md:text-2xl">Fraud Monitoring Dashboard</h1>
            <p className="text-sm text-slate-400">Graph intelligence + machine-learning risk outputs</p>
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Auto-refresh: 6s</p>
        </header>

        {showAlert ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border border-neonRed/40 bg-neonRed/10 px-4 py-3 text-sm text-neonRed shadow-glowRed"
          >
            High Risk Transaction Detected
          </motion.div>
        ) : null}

        <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Total Users" value={metrics.totalUsers} />
          <MetricCard label="Total Transactions" value={metrics.totalTransactions} />
          <MetricCard label="Fraud Detected" value={metrics.fraudDetected} accent="red" />
          <MetricCard label="High Risk Users" value={highRiskUsers} accent="red" />
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
          <FraudGraph graphData={graphData} selectedUserId={selectedUser?.id} onSelectUser={setSelectedUserId} />
          <UserDetailPanel user={selectedUser} />
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.7fr_1fr]">
          <TransactionsTable transactions={transactions} />
          <div className="space-y-4">
            <RiskChart fraudUsers={fraudUsers} />
            <LiveFeed transactions={transactions} />
          </div>
        </section>
      </div>
    </main>
  );
}
