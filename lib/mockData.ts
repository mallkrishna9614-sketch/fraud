import { FraudUser, GraphResponse, Transaction, TransactionStatus } from "./types";

const randomStatus = (): TransactionStatus => (Math.random() > 0.78 ? "Fraud" : "Normal");

export const generateTransactions = (count = 80): Transaction[] => {
  const users = Array.from({ length: 22 }, (_, idx) => `U-${idx + 1}`);

  return Array.from({ length: count }, (_, idx) => {
    const sender = users[Math.floor(Math.random() * users.length)];
    const receiver = users[Math.floor(Math.random() * users.length)];
    const status = randomStatus();

    return {
      id: `TX-${Date.now()}-${idx}`,
      sender,
      receiver: receiver === sender ? `U-${((idx + 4) % users.length) + 1}` : receiver,
      amount: Number((Math.random() * 9500 + 150).toFixed(2)),
      status,
      timestamp: new Date(Date.now() - idx * 1000 * 45).toISOString()
    };
  });
};

export const deriveFraudUsers = (transactions: Transaction[]): FraudUser[] => {
  const byUser = new Map<string, FraudUser>();

  for (const tx of transactions) {
    [tx.sender, tx.receiver].forEach((userId) => {
      if (!byUser.has(userId)) {
        byUser.set(userId, {
          id: userId,
          riskScore: 0,
          totalTransactions: 0,
          totalAmount: 0,
          connectedUsers: [],
          reasons: []
        });
      }
    });

    const senderState = byUser.get(tx.sender);
    if (senderState) {
      senderState.totalTransactions += 1;
      senderState.totalAmount += tx.amount;
      senderState.connectedUsers = Array.from(new Set([...senderState.connectedUsers, tx.receiver]));
      senderState.riskScore += tx.status === "Fraud" ? 18 : 2;
    }

    const receiverState = byUser.get(tx.receiver);
    if (receiverState) {
      receiverState.totalTransactions += 1;
      receiverState.totalAmount += tx.amount;
      receiverState.connectedUsers = Array.from(new Set([...receiverState.connectedUsers, tx.sender]));
      receiverState.riskScore += tx.status === "Fraud" ? 12 : 1;
    }
  }

  return [...byUser.values()]
    .map((user) => {
      const reasons = [];
      if (user.connectedUsers.length > 6) reasons.push("High number of connections");
      if (user.totalAmount / Math.max(user.totalTransactions, 1) > 4500) reasons.push("Unusual transaction amount");
      if (user.riskScore > 60) reasons.push("Suspicious network pattern");

      return {
        ...user,
        riskScore: Math.min(100, Number(user.riskScore.toFixed(1))),
        totalAmount: Number(user.totalAmount.toFixed(2)),
        reasons: reasons.length ? reasons : ["Low immediate risk indicators"]
      };
    })
    .sort((a, b) => b.riskScore - a.riskScore);
};

export const buildGraphData = (transactions: Transaction[]): GraphResponse => {
  const nodesMap = new Map<string, { id: string; label: string; riskScore: number; totalTransactions: number }>();

  transactions.forEach((tx) => {
    if (!nodesMap.has(tx.sender)) {
      nodesMap.set(tx.sender, { id: tx.sender, label: tx.sender, riskScore: 0, totalTransactions: 0 });
    }
    if (!nodesMap.has(tx.receiver)) {
      nodesMap.set(tx.receiver, { id: tx.receiver, label: tx.receiver, riskScore: 0, totalTransactions: 0 });
    }

    const sender = nodesMap.get(tx.sender);
    const receiver = nodesMap.get(tx.receiver);

    if (sender) {
      sender.totalTransactions += 1;
      sender.riskScore += tx.status === "Fraud" ? 16 : 2;
    }

    if (receiver) {
      receiver.totalTransactions += 1;
      receiver.riskScore += tx.status === "Fraud" ? 10 : 1;
    }
  });

  return {
    nodes: [...nodesMap.values()].map((node) => ({
      ...node,
      riskScore: Math.min(100, node.riskScore)
    })),
    edges: transactions.map((tx) => ({
      id: tx.id,
      source: tx.sender,
      target: tx.receiver,
      amount: tx.amount,
      status: tx.status
    }))
  };
};
