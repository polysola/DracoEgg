import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import XIcon from "../../icons/XIcon";
import TelegramIcon from "../../icons/TelegramIcon";
import { saveWhitelistWallet } from "../../services/userService";

interface TokenLaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
  username?: string;
}

const TokenLaunchModal: React.FC<TokenLaunchModalProps> = ({ isOpen, onClose, username }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [walletInput, setWalletInput] = useState<string>("");
  const [whitelistedWallet, setWhitelistedWallet] = useState<string>("");
  const [isEditingWallet, setIsEditingWallet] = useState<boolean>(false);

  const X_LINK = "https://x.com/ArcDracoEgg";
  const TELEGRAM_LINK = "https://t.me/EggRush_RobinHood";
  const MAINNET_DATE_STRING = "September 16, 2026 - 00:00 UTC";

  // Load saved whitelisted wallet from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("arcdraco_whitelist_wallet");
    if (saved) {
      setWhitelistedWallet(saved);
      setWalletInput(saved);
    }
  }, [isOpen]);

  // Countdown timer to ARC Network Mainnet (September 16, 2026 UTC)
  useEffect(() => {
    if (!isOpen) return;

    const calculateCountdown = () => {
      const now = new Date();
      // Target: September 16, 2026 00:00:00 UTC
      const target = new Date(Date.UTC(2026, 8, 16, 0, 0, 0));

      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleWalletInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWalletInput(e.target.value);
  };

  const handleJoinWhitelist = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = walletInput.trim();

    // Validate EVM format: starts with 0x and is 42 characters long hex
    const evmRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!trimmed) {
      toast.error("Please paste your EVM wallet address.");
      return;
    }

    if (!evmRegex.test(trimmed)) {
      toast.error("Invalid EVM wallet address! Must start with 0x and be 42 characters.");
      return;
    }

    localStorage.setItem("arcdraco_whitelist_wallet", trimmed);
    setWhitelistedWallet(trimmed);
    setIsEditingWallet(false);
    // Save to Firebase Firestore
    saveWhitelistWallet(trimmed, username);
    toast.success("🎉 You're whitelisted for ArcDraco Mainnet & OpenSea NFT mint!");
  };

  const handleEditWallet = () => {
    setIsEditingWallet(true);
  };

  const truncatedWhitelisted = whitelistedWallet
    ? `${whitelistedWallet.substring(0, 8)}...${whitelistedWallet.substring(whitelistedWallet.length - 6)}`
    : "";

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 bg-black/90 backdrop-blur-md animate-fade-in font-orbitron">
      <div className="w-full max-w-md bg-[#0b081e] border-2 border-[#a855f7]/70 rounded-[32px] p-5 sm:p-6 text-[#f5f3ff] shadow-[0_0_60px_rgba(168,85,247,0.4)] relative max-h-[95vh] overflow-y-auto">
        
        {/* Top ArcDraco Mascot & Text Logo Badge */}
        <div className="flex flex-col items-center justify-center mb-3">
          <div className="relative group mb-2">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#8b5cf6] via-[#00d2ff] to-[#ec4899] blur-md opacity-75 animate-pulse"></div>
            <img
              src="/Logo ARC Draco.png"
              alt="ArcDraco Mascot"
              className="relative w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-2xl bg-[#070514] border border-[#a855f7]/60 p-1 shadow-2xl"
            />
          </div>

          <div className="h-7 sm:h-8 flex items-center justify-center mb-1.5">
            <img
              src="/logotext.png"
              alt="ArcDraco"
              className="h-full object-contain filter drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]"
            />
          </div>

          <span className="px-3 py-1 rounded-full bg-[#8b5cf6]/20 border border-[#a855f7]/60 text-[#c084fc] text-[9px] font-black tracking-widest uppercase shadow-[0_0_15px_rgba(168,85,247,0.4)] animate-pulse flex items-center space-x-1.5">
            <span>⚡</span>
            <span>ARC NETWORK MAINNET & WHITELIST</span>
          </span>
        </div>

        {/* Highlight Mainnet & USDC / Meme / OpenSea Info */}
        <div className="bg-[#120e2e]/90 border border-[#8b5cf6]/40 rounded-2xl p-3.5 mb-3.5 shadow-[0_0_20px_rgba(139,92,246,0.15)] text-center space-y-2">
          <div className="flex items-center justify-center space-x-1.5 text-[#00d2ff] text-xs sm:text-sm font-black uppercase tracking-wider">
            <span>🌐</span>
            <span>MAINNET LAUNCH: SEPT 16, 2026</span>
          </div>
          
          <p className="text-[11px] sm:text-xs text-gray-200 leading-relaxed font-sans font-medium">
            ARC Network goes live on <span className="text-[#00d2ff] font-bold">September 16</span>. With confirmed <span className="text-[#ffe600] font-bold">USDC liquidity backing</span>, we will officially launch the <span className="text-[#c084fc] font-bold">ArcDraco Meme Token ($DRACO)</span> and open <span className="text-[#ec4899] font-bold">Free Genesis NFT Minting on OpenSea</span> right after Mainnet!
          </p>

          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-[#00d2ff]/15 text-[#00d2ff] border border-[#00d2ff]/30">
              💎 USDC Backed
            </span>
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-[#ec4899]/15 text-[#ec4899] border border-[#ec4899]/30">
              🌊 OpenSea NFT
            </span>
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-[#8b5cf6]/15 text-[#c084fc] border border-[#8b5cf6]/30">
              🚀 $DRACO Meme
            </span>
          </div>
        </div>

        {/* Live Countdown Clock to September 16, 2026 */}
        <div className="bg-[#080518] p-3.5 rounded-2xl border border-[#a855f7]/40 mb-3.5 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#8b5cf6]/15 via-transparent to-transparent pointer-events-none"></div>
          <p className="text-[9px] text-[#c084fc] font-black uppercase tracking-widest mb-2 neon-purple-glow">
            ⏱ MAINNET LAUNCH COUNTDOWN
          </p>

          <div className="grid grid-cols-4 gap-1.5 sm:gap-2 my-1">
            <div className="bg-[#140f32] px-2 py-2 rounded-xl border border-[#a855f7]/30">
              <span className="text-xl sm:text-2xl font-black text-white leading-none block">
                {timeLeft.days.toString().padStart(2, "0")}
              </span>
              <span className="text-[7px] sm:text-[8px] text-gray-400 font-bold uppercase tracking-wider block mt-1">DAYS</span>
            </div>
            <div className="bg-[#140f32] px-2 py-2 rounded-xl border border-[#a855f7]/30">
              <span className="text-xl sm:text-2xl font-black text-white leading-none block">
                {timeLeft.hours.toString().padStart(2, "0")}
              </span>
              <span className="text-[7px] sm:text-[8px] text-gray-400 font-bold uppercase tracking-wider block mt-1">HOURS</span>
            </div>
            <div className="bg-[#140f32] px-2 py-2 rounded-xl border border-[#a855f7]/30">
              <span className="text-xl sm:text-2xl font-black text-white leading-none block">
                {timeLeft.minutes.toString().padStart(2, "0")}
              </span>
              <span className="text-[7px] sm:text-[8px] text-gray-400 font-bold uppercase tracking-wider block mt-1">MINUTES</span>
            </div>
            <div className="bg-[#140f32] px-2 py-2 rounded-xl border border-[#00d2ff]/40 shadow-[0_0_10px_rgba(0,210,255,0.2)]">
              <span className="text-xl sm:text-2xl font-black text-[#00d2ff] leading-none block">
                {timeLeft.seconds.toString().padStart(2, "0")}
              </span>
              <span className="text-[7px] sm:text-[8px] text-[#00d2ff] font-bold uppercase tracking-wider block mt-1">SECONDS</span>
            </div>
          </div>

          <p className="text-[9px] text-gray-400 mt-2 font-mono">
            {MAINNET_DATE_STRING}
          </p>
        </div>

        {/* WHITELIST FORM: PASTE EVM WALLET ADDRESS */}
        <div className="bg-[#100b2b] p-4 rounded-2xl border-2 border-[#00d2ff]/50 mb-3.5 shadow-[0_0_25px_rgba(0,210,255,0.2)]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-black text-[#00d2ff] uppercase tracking-wider flex items-center space-x-1.5">
              <span>🎟️</span>
              <span>EARLY ACCESS WHITELIST</span>
            </p>
            <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-[#00d2ff]/20 text-[#00d2ff] uppercase border border-[#00d2ff]/40">
              GUARANTEED
            </span>
          </div>

          <p className="text-[10px] text-gray-300 font-sans mb-3 leading-tight">
            Paste your EVM wallet address (0x...) below to secure your whitelist spot for token airdrop and OpenSea Free Mint.
          </p>

          {whitelistedWallet && !isEditingWallet ? (
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-[#00d2ff]/10 border border-[#00d2ff]/40 flex items-center justify-between">
                <div className="flex items-center space-x-2 min-w-0">
                  <span className="text-sm">✅</span>
                  <div>
                    <span className="text-[9px] text-[#00d2ff] font-black uppercase tracking-wider block">
                      WHITELISTED WALLET
                    </span>
                    <span className="font-mono text-xs sm:text-sm text-white font-black truncate block">
                      {truncatedWhitelisted}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleEditWallet}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[9px] font-bold text-gray-300 transition-all uppercase"
                >
                  Edit
                </button>
              </div>
              <p className="text-[9px] text-[#a855f7] font-medium text-center font-sans">
                ⭐ Your wallet is registered for the September 16 ARC Mainnet Launch!
              </p>
            </div>
          ) : (
            <form onSubmit={handleJoinWhitelist} className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={walletInput}
                  onChange={handleWalletInputChange}
                  placeholder="Paste EVM wallet (0x...)"
                  className="w-full bg-[#070514] border border-[#a855f7]/50 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-500 font-mono focus:outline-none focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#8b5cf6] via-[#a855f7] to-[#00d2ff] hover:opacity-90 text-white font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
              >
                <span>🚀</span>
                <span>Join Early Whitelist</span>
              </button>
            </form>
          )}
        </div>

        {/* OFFICIAL SOCIAL CHANNELS */}
        <div className="grid grid-cols-2 gap-2 mb-3.5">
          <button
            onClick={() => window.open(X_LINK, "_blank")}
            className="py-3 rounded-2xl bg-[#140f32] hover:bg-[#8b5cf6]/20 border border-[#8b5cf6]/50 text-[#c084fc] font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 group hover:border-[#8b5cf6]"
          >
            <XIcon size={16} />
            <span>Follow on X</span>
          </button>
          <button
            onClick={() => window.open(TELEGRAM_LINK, "_blank")}
            className="py-3 rounded-2xl bg-[#140f32] hover:bg-[#00d2ff]/20 border border-[#00d2ff]/50 text-[#00d2ff] font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 group hover:border-[#00d2ff]"
          >
            <TelegramIcon size={16} />
            <span>Telegram</span>
          </button>
        </div>

        {/* Enter ArcDraco Game Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#8b5cf6] via-[#a855f7] to-[#00d2ff] text-white font-black text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:shadow-[0_0_40px_rgba(0,210,255,0.7)] transition-all cursor-pointer active:scale-98"
        >
          🐉 Enter ArcDraco Game
        </button>

      </div>
    </div>
  );
};

export default TokenLaunchModal;
