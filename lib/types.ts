export type TransactionStatus = "Fraud" | "Normal";

export type Transaction = {
  id: string;
  sender: string;
  receiver: string;
  amount: number;
  status: TransactionStatus;
  timestamp: string;
};

export type FraudUser = {
  id: string;
  riskScore: number;
  totalTransactions: number;
  totalAmount: number;
  connectedUsers: string[];
  reasons: string[];
};

export type GraphNodeData = {
  id: string;
  label: string;
  riskScore: number;
  totalTransactions: number;
};

export type GraphEdgeData = {
  id: string;
  source: string;
  target: string;
  amount: number;
  status: TransactionStatus;
};

export type GraphResponse = {
  nodes: GraphNodeData[];
  edges: GraphEdgeData[];
};
