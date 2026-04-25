"use client";

import { useMemo, useState } from "react";
import { Transaction } from "@/lib/types";

type TransactionsTableProps = {
  transactions: Transaction[];
};

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Fraud" | "Normal">("All");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    const lowered = query.toLowerCase();
    return transactions
      .filter((tx) => (statusFilter === "All" ? true : tx.status === statusFilter))
      .filter((tx) => [tx.sender, tx.receiver, tx.id].some((value) => value.toLowerCase().includes(lowered)))
      .sort((a, b) => (sortDir === "asc" ? a.amount - b.amount : b.amount - a.amount));
  }, [transactions, query, statusFilter, sortDir]);

  return (
    <div className="rounded-2xl border border-slate-700/70 bg-panel p-4 backdrop-blur-md">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search sender/receiver"
          className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as "All" | "Fraud" | "Normal")}
          className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100"
        >
          <option value="All">All</option>
          <option value="Fraud">Fraud</option>
          <option value="Normal">Normal</option>
        </select>
        <button
          onClick={() => setSortDir((current) => (current === "asc" ? "desc" : "asc"))}
          className="rounded-lg border border-neonBlue/40 px-3 py-2 text-xs uppercase tracking-wider text-neonBlue"
        >
          Sort Amount: {sortDir}
        </button>
      </div>

      <div className="max-h-[320px] overflow-auto">
        <table className="w-full text-sm text-slate-200">
          <thead className="sticky top-0 bg-slate-950/90 text-xs uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-2 py-2 text-left">Sender</th>
              <th className="px-2 py-2 text-left">Receiver</th>
              <th className="px-2 py-2 text-left">Amount</th>
              <th className="px-2 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx) => (
              <tr key={tx.id} className="border-b border-slate-800/60">
                <td className="px-2 py-2">{tx.sender}</td>
                <td className="px-2 py-2">{tx.receiver}</td>
                <td className="px-2 py-2">₹{tx.amount.toLocaleString()}</td>
                <td className="px-2 py-2">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      tx.status === "Fraud" ? "bg-neonRed/20 text-neonRed" : "bg-neonGreen/20 text-neonGreen"
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
