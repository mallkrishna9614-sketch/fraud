import { buildGraphData, deriveFraudUsers, generateTransactions } from "./mockData";
import { FraudUser, GraphResponse, Transaction } from "./types";

const fetchJson = async <T>(endpoint: string): Promise<T | null> => {
  try {
    const response = await fetch(endpoint, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store"
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
};

export const getTransactions = async (): Promise<Transaction[]> => {
  const data = await fetchJson<Transaction[]>("/transactions");
  return data ?? generateTransactions();
};

export const getFraudUsers = async (transactions: Transaction[]): Promise<FraudUser[]> => {
  const data = await fetchJson<FraudUser[]>("/fraud-users");
  return data ?? deriveFraudUsers(transactions);
};

export const getGraphData = async (transactions: Transaction[]): Promise<GraphResponse> => {
  const data = await fetchJson<GraphResponse>("/graph-data");
  return data ?? buildGraphData(transactions);
};
