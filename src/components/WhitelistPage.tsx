import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import XIcon from "../icons/XIcon";
import TelegramIcon from "../icons/TelegramIcon";
import { saveWhitelistSubmission } from "../services/userService";

interface WhitelistPageProps {
  onBack?: () => void;
  onOpenAnnouncement?: () => void;
  currentUser?: string;
  currentWalletAddress?: string;
}

interface StoredWhitelistData {
  walletAddress: string;
  xAccount: string;
  retweetLink: string;
  submittedAt: string;
  passId: string;
}

const WhitelistPage: React.FC<WhitelistPageProps> = ({
  currentUser,
  currentWalletAddress,
  onOpenAnnouncement,
}) => {
  const [xAccount, setXAccount] = useState<string>("");
  const [retweetLink, setRetweetLink] = useState<string>("");
  const [walletInput, setWalletInput] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [whitelistData, setWhitelistData] = useState<StoredWhitelistData | null>(null);

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const X_OFFICIAL_URL = "https://x.com/ArcDracoEgg";
  const TELEGRAM_URL = "https://t.me/ArcDraco_Portal";
  const LOCAL_STORAGE_KEY = "arcdraco_whitelist_submission";

  // Load stored submission from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed: StoredWhitelistData = JSON.parse(saved);
        setWhitelistData(parsed);
        setXAccount(parsed.xAccount || "");
        setRetweetLink(parsed.retweetLink || "");
        setWalletInput(parsed.walletAddress || "");
      } catch (err) {
        console.error("Failed to parse stored whitelist:", err);
      }
    } else if (currentWalletAddress) {
      setWalletInput(currentWalletAddress);
    }
  }, [currentWalletAddress]);

  // Mainnet countdown (September 16, 2026 UTC)
  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
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
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleUseConnectedWallet = () => {
    if (!currentWalletAddress) {
      toast.info("No wallet connected in game yet! Please paste your 0x... address manually.");
      return;
    }
    setWalletInput(currentWalletAddress);
    toast.success("Connected EVM wallet address filled!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanX = xAccount.trim();
    const cleanRetweet = retweetLink.trim();
    const cleanWallet = walletInput.trim();

    // 1. Validation for X account
    if (!cleanX) {
      toast.error("Please enter your X (Twitter) handle (e.g. @yourname).");
      return;
    }

    // 2. Validation for EVM Wallet
    const evmRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!cleanWallet) {
      toast.error("Please enter your EVM wallet address.");
      return;
    }
    if (!evmRegex.test(cleanWallet)) {
      toast.error("Invalid EVM wallet format! Must start with 0x and be 42 characters.");
      return;
    }

    // 3. Validation for Retweet link
    if (!cleanRetweet) {
      toast.error("Please provide your Retweet link or confirmation URL from X.");
      return;
    }

    setIsSubmitting(true);
    const passId = whitelistData?.passId || `DRACO-${Math.floor(100000 + Math.random() * 900000)}`;

    const submissionPayload: StoredWhitelistData = {
      walletAddress: cleanWallet,
      xAccount: cleanX.startsWith("@") ? cleanX : `@${cleanX}`,
      retweetLink: cleanRetweet,
      submittedAt: new Date().toISOString(),
      passId,
    };

    try {
      // Save to Firebase Firestore
      const ok = await saveWhitelistSubmission({
        walletAddress: submissionPayload.walletAddress,
        xAccount: submissionPayload.xAccount,
        retweetLink: submissionPayload.retweetLink,
        username: currentUser || "anonymous",
      });

      // Save locally
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(submissionPayload));
      localStorage.setItem("arcdraco_whitelist_wallet", cleanWallet);
      setWhitelistData(submissionPayload);
      setIsEditing(false);

      if (ok) {
        toast.success("🎉 Whitelist application submitted successfully to ARC Network!");
      } else {
        toast.info("🎉 Whitelist saved locally! Will sync to Firestore as network allows.");
      }
    } catch (error) {
      console.error("Error during whitelist submission:", error);
      toast.error("An error occurred during submission. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const truncatedWallet = (addr: string) => {
    if (!addr || addr.length < 12) return addr;
    return `${addr.substring(0, 8)}...${addr.substring(addr.length - 6)}`;
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto pb-24 font-orbitron text-[#f5f3ff]">
      {/* Top Header Bar */}
      <div className="px-3 pt-3 flex items-center justify-between z-10">
        {onOpenAnnouncement ? (
          <button
            type="button"
            onClick={onOpenAnnouncement}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#8b5cf6]/20 hover:bg-[#8b5cf6]/30 border border-[#8b5cf6]/50 text-xs font-black uppercase text-[#00d2ff] transition-all shadow-[0_0_12px_rgba(139,92,246,0.3)] cursor-pointer"
          >
            <span>📢</span>
            <span>View Announcement</span>
          </button>
        ) : (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[11px] font-bold text-gray-400">
            <span>🔒</span>
            <span>Early Access</span>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <img src="/logotext.png" alt="ArcDraco" className="h-5 object-contain filter drop-shadow-[0_0_8px_#8b5cf6]" />
        </div>
      </div>

      <div className="px-3 pt-3 space-y-4">
        {/* Hero Banner with Dragon Logo */}
        <div className="relative rounded-[28px] p-5 text-center overflow-hidden border border-[#8b5cf6]/40 bg-gradient-to-b from-[#140b33]/90 via-[#0a0720]/95 to-[#070514] shadow-[0_0_40px_rgba(139,92,246,0.3)]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-[#8b5cf6]/20 blur-3xl pointer-events-none"></div>

          <div className="relative inline-block mx-auto mb-2">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#8b5cf6] via-[#00d2ff] to-[#ec4899] blur opacity-75 animate-pulse"></div>
            <img
              src="/logo-arc-draco.png"
              alt="ArcDraco Dragon"
              className="relative w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-2xl bg-[#070514] border border-[#a855f7]/60 p-1 shadow-2xl"
            />
          </div>

          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white neon-purple-glow leading-tight">
            ArcDraco Whitelist Portal
          </h2>
          <p className="text-[11px] sm:text-xs text-gray-300 font-sans font-medium mt-1 max-w-sm mx-auto">
            Join the official Whitelist for the <span className="text-[#00d2ff] font-bold">ARC Network Mainnet</span>, guaranteed allocation for <span className="text-[#c084fc] font-bold">$DRACO Meme Token</span> and <span className="text-[#ec4899] font-bold">OpenSea Genesis NFT Free Mint</span>!
          </p>

          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#00d2ff]/15 text-[#00d2ff] border border-[#00d2ff]/30">
              💎 USDC Backed Liquidity
            </span>
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#8b5cf6]/15 text-[#c084fc] border border-[#8b5cf6]/30">
              ⚡ ARC Network Mainnet
            </span>
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#ec4899]/15 text-[#ec4899] border border-[#ec4899]/30">
              🌊 OpenSea Genesis NFT
            </span>
          </div>
        </div>

        {/* Countdown to September 16, 2026 */}
        <div className="bg-[#0b0824] p-3.5 rounded-2xl border border-[#a855f7]/40 text-center">
          <p className="text-[10px] text-[#c084fc] font-black uppercase tracking-wider mb-2">
            ⏱ MAINNET GOES LIVE IN (SEPTEMBER 16, 2026 UTC)
          </p>
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-[#140f36] py-2 rounded-xl border border-[#8b5cf6]/30">
              <span className="text-xl sm:text-2xl font-black text-white block leading-none">
                {timeLeft.days.toString().padStart(2, "0")}
              </span>
              <span className="text-[7px] sm:text-[8px] text-gray-400 font-bold uppercase block mt-1">Days</span>
            </div>
            <div className="bg-[#140f36] py-2 rounded-xl border border-[#8b5cf6]/30">
              <span className="text-xl sm:text-2xl font-black text-white block leading-none">
                {timeLeft.hours.toString().padStart(2, "0")}
              </span>
              <span className="text-[7px] sm:text-[8px] text-gray-400 font-bold uppercase block mt-1">Hours</span>
            </div>
            <div className="bg-[#140f36] py-2 rounded-xl border border-[#8b5cf6]/30">
              <span className="text-xl sm:text-2xl font-black text-white block leading-none">
                {timeLeft.minutes.toString().padStart(2, "0")}
              </span>
              <span className="text-[7px] sm:text-[8px] text-gray-400 font-bold uppercase block mt-1">Mins</span>
            </div>
            <div className="bg-[#140f36] py-2 rounded-xl border border-[#00d2ff]/40 shadow-[0_0_12px_rgba(0,210,255,0.25)]">
              <span className="text-xl sm:text-2xl font-black text-[#00d2ff] block leading-none">
                {timeLeft.seconds.toString().padStart(2, "0")}
              </span>
              <span className="text-[7px] sm:text-[8px] text-[#00d2ff] font-bold uppercase block mt-1">Secs</span>
            </div>
          </div>
        </div>

        {/* If user already submitted and not in edit mode: Show Golden Cyber Whitelist Ticket */}
        {whitelistData && !isEditing ? (
          <div className="rounded-[28px] p-5 border-2 border-[#ffe600]/60 bg-gradient-to-b from-[#1c1438] via-[#0d0924] to-[#070514] shadow-[0_0_40px_rgba(255,230,0,0.25)] space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffe600]/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🎟️</span>
                <div>
                  <h3 className="text-sm font-black text-[#ffe600] uppercase tracking-wider">
                    Genesis Whitelist Pass
                  </h3>
                  <span className="text-[9px] text-gray-400 font-mono">ID: {whitelistData.passId}</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#00d2ff]/20 text-[#00d2ff] border border-[#00d2ff]/40 text-[9px] font-black uppercase">
                ✓ VERIFIED
              </span>
            </div>

            <div className="space-y-2.5 text-xs font-sans">
              <div className="bg-[#080518] p-3 rounded-xl border border-white/10 flex justify-between items-center">
                <span className="text-gray-400 text-[11px]">EVM Wallet:</span>
                <span className="font-mono text-white font-bold text-xs truncate max-w-[200px]">
                  {truncatedWallet(whitelistData.walletAddress)}
                </span>
              </div>

              <div className="bg-[#080518] p-3 rounded-xl border border-white/10 flex justify-between items-center">
                <span className="text-gray-400 text-[11px]">X (Twitter) Account:</span>
                <span className="text-[#00d2ff] font-mono font-bold text-xs">
                  {whitelistData.xAccount}
                </span>
              </div>

              <div className="bg-[#080518] p-3 rounded-xl border border-white/10 flex justify-between items-center">
                <span className="text-gray-400 text-[11px]">Retweet Link:</span>
                <a
                  href={whitelistData.retweetLink.startsWith("http") ? whitelistData.retweetLink : `https://${whitelistData.retweetLink}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#c084fc] underline truncate max-w-[180px] text-[11px] font-mono hover:text-white"
                >
                  {whitelistData.retweetLink}
                </a>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#8b5cf6]/15 border border-[#8b5cf6]/30 text-center space-y-1 font-sans">
              <p className="text-xs text-[#c084fc] font-bold">
                🎉 Your spot is guaranteed for Mainnet Launch on Sept 16, 2026!
              </p>
              <p className="text-[10px] text-gray-300">
                You will be eligible to claim the $DRACO token airdrop and free mint Genesis NFT on OpenSea.
              </p>
            </div>

            <div className="flex space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-black uppercase text-gray-300 hover:text-white transition-all cursor-pointer"
              >
                ✏️ Edit Info
              </button>
              {onOpenAnnouncement && (
                <button
                  type="button"
                  onClick={onOpenAnnouncement}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#8b5cf6] via-[#a855f7] to-[#00d2ff] text-white font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:opacity-90 transition-all cursor-pointer"
                >
                  📢 Announcement
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Submission Form */
          <form onSubmit={handleSubmit} className="rounded-[28px] p-5 border border-[#8b5cf6]/40 bg-[#0d0926] shadow-[0_0_30px_rgba(139,92,246,0.25)] space-y-4">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-white flex items-center space-x-2">
                <span>📝</span>
                <span>Submit Whitelist Information</span>
              </h3>
              <p className="text-[10px] text-gray-400 font-sans mt-0.5">
                Complete all 3 tasks below to be included in the official Genesis Whitelist snapshot.
              </p>
            </div>

            {/* Step 1: X Account */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-[#00d2ff] flex items-center space-x-1.5">
                  <span>1.</span>
                  <span>X (Twitter) Handle</span>
                </label>
                <a
                  href={X_OFFICIAL_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-[#c084fc] hover:text-white flex items-center space-x-1 underline font-sans font-bold"
                >
                  <span>Follow @ArcDracoEgg</span>
                  <span>↗</span>
                </a>
              </div>
              <input
                type="text"
                value={xAccount}
                onChange={(e) => setXAccount(e.target.value)}
                placeholder="e.g. @YourUsername"
                className="w-full bg-[#070514] border border-[#8b5cf6]/40 focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 font-mono focus:outline-none transition-all"
              />
            </div>

            {/* Step 2: Retweet Task */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-[#00d2ff] flex items-center space-x-1.5">
                  <span>2.</span>
                  <span>Retweet Pinned Post</span>
                </label>
                <a
                  href={X_OFFICIAL_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-0.5 rounded-md bg-[#8b5cf6]/20 hover:bg-[#8b5cf6] text-[#c084fc] hover:text-white border border-[#8b5cf6]/40 text-[9px] font-bold uppercase transition-all"
                >
                  🔁 Open & Retweet ↗
                </a>
              </div>
              <input
                type="text"
                value={retweetLink}
                onChange={(e) => setRetweetLink(e.target.value)}
                placeholder="Paste your Retweet / Quote URL from X"
                className="w-full bg-[#070514] border border-[#8b5cf6]/40 focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 font-mono focus:outline-none transition-all"
              />
            </div>

            {/* Step 3: EVM Wallet Address */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-[#00d2ff] flex items-center space-x-1.5">
                  <span>3.</span>
                  <span>EVM Wallet Address (ARC)</span>
                </label>
                {currentWalletAddress && (
                  <button
                    type="button"
                    onClick={handleUseConnectedWallet}
                    className="text-[9px] text-[#ffe600] hover:underline font-bold"
                  >
                    ⚡ Use Connected
                  </button>
                )}
              </div>
              <input
                type="text"
                value={walletInput}
                onChange={(e) => setWalletInput(e.target.value)}
                placeholder="0x... (42-character EVM address)"
                className="w-full bg-[#070514] border border-[#8b5cf6]/40 focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 font-mono focus:outline-none transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#8b5cf6] via-[#a855f7] to-[#00d2ff] text-white font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all cursor-pointer ${
                isSubmitting ? "opacity-60 cursor-not-allowed" : "hover:opacity-90 active:scale-[0.99]"
              }`}
            >
              {isSubmitting ? "Submitting Application..." : "🚀 Submit Whitelist Application"}
            </button>

            {whitelistData && isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-full py-2 text-center text-gray-400 text-xs font-bold uppercase hover:text-white transition-all"
              >
                Cancel Edit
              </button>
            )}
          </form>
        )}

        {/* Social Link Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={() => window.open(X_OFFICIAL_URL, "_blank")}
            className="py-3 rounded-2xl bg-[#120e2e] hover:bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 text-[#c084fc] font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
          >
            <XIcon size={16} />
            <span>ArcDraco on X</span>
          </button>
          <button
            onClick={() => window.open(TELEGRAM_URL, "_blank")}
            className="py-3 rounded-2xl bg-[#120e2e] hover:bg-[#00d2ff]/20 border border-[#00d2ff]/40 text-[#00d2ff] font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
          >
            <TelegramIcon size={16} />
            <span>Telegram Channel</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhitelistPage;
