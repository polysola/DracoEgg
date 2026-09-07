import React from "react";
import { toast } from "react-toastify";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { username: string; displayName?: string; telegramHandle?: string; photoUrl?: string } | null;
  userPoints: number;
  walletAddress: string;
  levelName: string;
  levelIndex: number;
  profitPerHour: number;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  userPoints,
  walletAddress,
  levelName,
  levelIndex,
  profitPerHour,
}) => {
  if (!isOpen) return null;

  const isConnected = Boolean(walletAddress);
  const truncatedWallet = isConnected
    ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
    : "Not Connected";

  const formattedPoints = userPoints.toLocaleString(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  const handleCopyWallet = () => {
    if (!walletAddress) {
      toast.info("No wallet connected yet.");
      return;
    }
    navigator.clipboard.writeText(walletAddress);
    toast.success("Wallet address copied to clipboard!");
  };

  // Mocked Web3 On-Chain Demo Transaction Logs with DRACO Token Symbol
  const transactions = [
    {
      id: "tx-1",
      title: "⚡ Tap Core Mining Rewards",
      txHash: "0x9a8f...4e1b",
      time: "2 mins ago",
      amount: "+50.0 DRACO",
      status: "DEMO TESTNET",
      color: "text-[#c084fc]",
    },
    {
      id: "tx-2",
      title: "🎁 Daily Cyber Streak Claim",
      txHash: "0x3d2c...1a9e",
      time: "2 hrs ago",
      amount: "+2,500.0 DRACO",
      status: "DEMO TESTNET",
      color: "text-[#c084fc]",
    },
    {
      id: "tx-3",
      title: "🔐 Daily Cipher Morse Solution",
      txHash: "0x7b1a...8f3c",
      time: "5 hrs ago",
      amount: "+2,500.0 DRACO",
      status: "DEMO TESTNET",
      color: "text-[#00d2ff]",
    },
    {
      id: "tx-4",
      title: "🤖 Auto Bot Offline Mining Collect",
      txHash: "0x1e5f...9b2d",
      time: "Yesterday",
      amount: "+3,600.0 DRACO",
      status: "DEMO TESTNET",
      color: "text-[#ec4899]",
    },
    {
      id: "tx-5",
      title: "🎟️ Daily Combo Trio Jackpot",
      txHash: "0x8a4d...2e7f",
      time: "Yesterday",
      amount: "+5,000.0 DRACO",
      status: "DEMO TESTNET",
      color: "text-[#ffe600]",
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in font-orbitron">
      <div className="w-full max-w-md bg-[#0b081e] border border-[#a855f7]/50 rounded-[28px] p-5 text-[#f5f3ff] shadow-[0_0_50px_rgba(168,85,247,0.3)] relative max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">👤</span>
            <div>
              <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight neon-purple-glow leading-none">ArcDraco Cyber Profile</h3>
              <span className="text-[9px] text-[#00d2ff] font-black tracking-widest uppercase">ARC TESTNET ACTIVE</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#8b5cf6]/20 transition-all shrink-0"
          >
            ✕
          </button>
        </div>

        {/* 1. Cyber Identity Profile Banner */}
        <div className="bg-[#070514] p-4 rounded-2xl border border-[#8b5cf6]/30 mb-4 flex items-center space-x-3.5 relative overflow-hidden">
          <div className="p-0.5 rounded-full bg-gradient-to-r from-[#8b5cf6] via-[#00d2ff] to-[#ec4899] shadow-[0_0_15px_rgba(168,85,247,0.5)] shrink-0">
            <img
              src={user?.photoUrl || "/Logo ARC Draco.png"}
              alt="Avatar"
              className="w-14 h-14 rounded-full border-2 border-[#070514] object-contain bg-[#8b5cf6]/10 p-0.5"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h4 className="text-base font-black text-white truncate">{user?.displayName || user?.username || "Arc Champion"}</h4>
              <span className="text-[9px] font-black text-[#ec4899] bg-[#ec4899]/10 px-2 py-0.5 rounded-md border border-[#ec4899]/30 uppercase shrink-0">
                {levelName}
              </span>
            </div>

            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-gray-400 font-bold">Level {levelIndex + 1}</span>
              <span className="text-[10px] text-[#00d2ff] font-mono font-bold bg-[#00d2ff]/10 px-2 py-0.5 rounded-md border border-[#00d2ff]/30 truncate">
                {truncatedWallet}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Web3 Financial Overview Summary */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-[#070514] p-2.5 rounded-2xl border border-white/10 text-center">
            <p className="text-[8px] text-gray-400 font-bold uppercase mb-0.5">GAME POINTS</p>
            <p className="text-xs font-black text-[#c084fc] neon-purple-glow truncate">{formattedPoints}</p>
          </div>
          <div className="bg-[#070514] p-2.5 rounded-2xl border border-white/10 text-center">
            <p className="text-[8px] text-gray-400 font-bold uppercase mb-0.5">WALLET BAL</p>
            <p className="text-xs font-black text-[#ffe600] yellow-glow truncate">{isConnected ? "0.0000 ETH" : "0.0000"}</p>
          </div>
          <div className="bg-[#070514] p-2.5 rounded-2xl border border-white/10 text-center">
            <p className="text-[8px] text-gray-400 font-bold uppercase mb-0.5">PROFIT / HR</p>
            <p className="text-xs font-black text-[#00d2ff] truncate">+{profitPerHour / 1000}K</p>
          </div>
        </div>

        {/* 3. Web3 On-Chain Transaction History Ledger with EXPLICIT DEMO TESTNET BADGE */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-black text-[#c084fc] uppercase flex items-center space-x-1.5 neon-purple-glow">
              <span>📜</span> <span>ON-CHAIN TRANSACTIONS LOG</span>
            </p>
            <span className="text-[9px] font-black text-[#00d2ff] bg-[#00d2ff]/10 px-2 py-0.5 rounded-full border border-[#00d2ff]/30 animate-pulse">
              ARC TESTNET
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-[#070514] p-2.5 rounded-xl border border-white/5 hover:border-[#8b5cf6]/40 transition-all flex justify-between items-center"
              >
                <div className="space-y-0.5 min-w-0 pr-2">
                  <p className="text-xs font-bold text-white truncate">{tx.title}</p>
                  <p className="text-[9px] font-mono text-gray-400">
                    Tx: <span className="text-gray-300">{tx.txHash}</span> • {tx.time}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-xs font-mono font-black ${tx.color}`}>{tx.amount}</p>
                  <span className="text-[8px] font-bold text-gray-400 block uppercase">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[9px] text-gray-500 italic mt-1.5 text-center">
            * Note: Transaction logs above are simulated Web3 On-Chain Demo Logs on ARC Network Testnet.
          </p>
        </div>

        {/* 4. 📖 DETAILED PROTOCOL GUIDE */}
        <div className="bg-[#070514]/90 p-3.5 rounded-2xl border border-[#00d2ff]/30 mb-4 space-y-1.5 text-xs">
          <p className="font-black text-[#00d2ff] uppercase flex items-center space-x-1.5 text-[11px]">
            <span>📖</span> <span>DETAILED PROFILE & TRANSACTIONS GUIDE</span>
          </p>
          <ul className="text-gray-300 space-y-1 text-[10px] sm:text-[11px] list-disc list-inside">
            <li>Your identity is protected by end-to-end cryptography on the <strong>ARC Network</strong>.</li>
            <li>All tap mining gains, streak bonuses, and cipher rewards generate verifiable <strong>On-Chain Ledger Logs (Demo)</strong>.</li>
            <li>Click <strong>COPY</strong> to share your wallet address with teammates.</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleCopyWallet}
            className="py-3 rounded-2xl bg-[#8b5cf6]/20 hover:bg-[#8b5cf6] hover:text-white border border-[#8b5cf6]/50 text-[#c084fc] font-black text-xs uppercase tracking-wider transition-all"
          >
            Copy Address
          </button>
          <button
            onClick={onClose}
            className="py-3 rounded-2xl bg-gradient-to-r from-[#8b5cf6] via-[#a855f7] to-[#00d2ff] text-white font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:opacity-90 transition-all"
          >
            Close Profile
          </button>
        </div>

      </div>
    </div>
  );
};

export default UserProfileModal;
