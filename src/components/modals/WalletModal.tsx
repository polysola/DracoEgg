import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ethers } from "ethers";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  userPoints: number;
  walletAddress: string;
  onConnectWallet: (address: string) => void;
  onDisconnectWallet: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  userPoints,
  walletAddress,
  onConnectWallet,
  onDisconnectWallet,
}) => {
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [selectedChain, setSelectedChain] = useState<"ARC" | "Ethereum">("ARC");
  const [ethBalance, setEthBalance] = useState<string>("0.0000");

  const isConnected = Boolean(walletAddress);

  useEffect(() => {
    const fetchBalance = async () => {
      if (isConnected && (window as any).ethereum && walletAddress.startsWith("0x")) {
        try {
          const provider = new ethers.BrowserProvider((window as any).ethereum);
          const bal = await provider.getBalance(walletAddress);
          const ethStr = ethers.formatEther(bal);
          setEthBalance(parseFloat(ethStr).toFixed(4));
        } catch (err) {
          setEthBalance("0.0000");
        }
      } else {
        setEthBalance("0.0000");
      }
    };
    if (isOpen) {
      fetchBalance();
    }
  }, [isOpen, isConnected, walletAddress]);

  if (!isOpen) return null;

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      if ((window as any).ethereum) {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        if (accounts.length > 0) {
          const addr = accounts[0];
          onConnectWallet(addr);
          toast.success("Web3 Wallet connected successfully!");
        }
      } else {
        // Redirect to MetaMask Mobile App via Deep Link without generating fake addresses
        const currentUrl = window.location.href.replace(/^https?:\/\//, "");
        const metamaskDeepLink = `https://metamask.app.link/dapp/${currentUrl}`;
        toast.info("Redirecting to MetaMask Mobile App...");
        setTimeout(() => {
          window.open(metamaskDeepLink, "_blank");
        }, 500);
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
      toast.error("Failed to connect Web3 Wallet.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCopyAddress = () => {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress);
    toast.success("Wallet address copied to clipboard!");
  };

  const truncatedAddress = isConnected
    ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
    : "Not Connected Yet";

  // Format Total Game Points with exactly 1 decimal place
  const formattedPoints = userPoints.toLocaleString(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in font-orbitron">
      <div className="w-full max-w-md bg-[#0b081e] border border-[#a855f7]/50 rounded-[28px] p-5 text-[#f5f3ff] shadow-[0_0_50px_rgba(168,85,247,0.3)] relative max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? "bg-[#00d2ff] animate-ping" : "bg-gray-500"}`}></div>
            <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight neon-purple-glow whitespace-nowrap">Web3 Arc Wallet</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#8b5cf6]/20 transition-all shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Network Selector */}
        <div className="grid grid-cols-2 gap-2 mb-4 bg-[#070514] p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setSelectedChain("ARC")}
            className={`py-2 px-1 rounded-xl font-black text-[11px] whitespace-nowrap transition-all text-center ${
              selectedChain === "ARC"
                ? "bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            ARC Network EVM
          </button>
          <button
            onClick={() => setSelectedChain("Ethereum")}
            className={`py-2 px-1 rounded-xl font-black text-[11px] whitespace-nowrap transition-all text-center ${
              selectedChain === "Ethereum"
                ? "bg-[#00d2ff] text-black shadow-[0_0_15px_#00d2ff]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Ethereum Mainnet
          </button>
        </div>

        {/* Wallet Status Box */}
        <div className="bg-[#070514] p-3.5 rounded-2xl border border-[#a855f7]/30 mb-4 space-y-2.5">
          <div className="flex justify-between items-center gap-1">
            <span className="text-[10px] sm:text-[11px] text-gray-400 font-bold uppercase tracking-wider whitespace-nowrap">CONNECTED EVM</span>
            <span
              className={`text-[10px] px-2.5 py-1 rounded-full font-black border flex items-center space-x-1 whitespace-nowrap shrink-0 ${
                isConnected
                  ? "text-[#00d2ff] bg-[#00d2ff]/10 border-[#00d2ff]/30"
                  : "text-gray-400 bg-white/5 border-white/10"
              }`}
            >
              <span>{isConnected ? "CONNECTED" : "DISCONNECTED"}</span>
              {isConnected && <span className="text-[9px]">✓</span>}
            </span>
          </div>
          <div className="flex justify-between items-center bg-black/40 p-2.5 rounded-xl border border-white/5">
            <span className={`font-mono text-xs sm:text-sm font-bold whitespace-nowrap ${isConnected ? "text-[#00d2ff]" : "text-gray-500"}`}>
              {truncatedAddress}
            </span>
            {isConnected && (
              <button
                onClick={handleCopyAddress}
                className="text-[10px] bg-[#8b5cf6]/20 hover:bg-[#8b5cf6] hover:text-white text-[#c084fc] font-black px-2.5 py-1 rounded-lg transition-all border border-[#8b5cf6]/40 shrink-0"
              >
                COPY
              </button>
            )}
          </div>
        </div>

        {/* Balance Display */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-[#070514] p-3 rounded-2xl border border-white/10 text-center overflow-hidden">
            <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase mb-1 whitespace-nowrap">Total Game Points</p>
            <p className="text-base sm:text-lg font-black text-[#c084fc] neon-purple-glow truncate">{formattedPoints}</p>
          </div>
          <div className="bg-[#070514] p-3 rounded-2xl border border-white/10 text-center overflow-hidden">
            <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase mb-1 whitespace-nowrap">Wallet Balance</p>
            <p className="text-base sm:text-lg font-black text-[#ffe600] yellow-glow truncate">{ethBalance} ETH</p>
          </div>
        </div>

        {/* 📖 DETAILED PROTOCOL GUIDE */}
        <div className="bg-[#070514]/90 p-3.5 rounded-2xl border border-[#00d2ff]/30 mb-4 space-y-1.5 text-xs">
          <p className="font-black text-[#00d2ff] uppercase flex items-center space-x-1.5 text-[11px]">
            <span>📖</span> <span>DETAILED WALLET PROTOCOL GUIDE</span>
          </p>
          <ul className="text-gray-300 space-y-1 text-[10px] sm:text-[11px] list-disc list-inside">
            <li>Connects seamlessly via <strong>ethers.js</strong> on the <strong>ARC Network</strong>.</li>
            <li>Supports <strong>MetaMask Mobile Deep Link</strong> inside Telegram WebView.</li>
            <li>Press <strong>Connect EVM Wallet</strong> to synchronize your wallet address.</li>
          </ul>
        </div>

        {/* Action Button */}
        {isConnected ? (
          <div className="space-y-2">
            <button
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-xs tracking-wider uppercase transition-all"
            >
              Switch Wallet Address
            </button>
            <button
              onClick={() => {
                onDisconnectWallet();
                toast.info("Wallet disconnected.");
              }}
              className="w-full py-3 rounded-2xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 font-black text-xs tracking-wider uppercase transition-all"
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <button
            onClick={handleConnectWallet}
            disabled={isConnecting}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#8b5cf6] via-[#a855f7] to-[#00d2ff] text-white font-black text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:scale-[1.02] transition-all"
          >
            {isConnecting ? "Connecting Web3..." : "Connect EVM Wallet"}
          </button>
        )}
      </div>
    </div>
  );
};

export default WalletModal;
