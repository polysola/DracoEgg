import React from "react";

export interface NotificationItem {
  id: string;
  type: "bot" | "launch" | "reward" | "cipher" | "combo";
  title: string;
  message: string;
  timestamp: number; // Real Unix timestamp in ms
  unread: boolean;
  actionText?: string;
  onAction?: () => void;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onClearAll: () => void;
}

export const getRelativeTimeString = (timestamp: any): string => {
  let ts = Number(timestamp);
  if (!ts || isNaN(ts) || ts <= 0) {
    ts = Date.now();
  }

  const diffSec = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (diffSec < 10) return "Just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}d ago`;
};

const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in font-orbitron">
      <div className="w-full max-w-md bg-[#0a0720] border border-[#8b5cf6]/40 rounded-[28px] p-5 text-[#f0eeff] shadow-[0_0_50px_rgba(139,92,246,0.3)] relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl animate-bounce">🔔</span>
            <div>
              <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight neon-purple-glow leading-none">Notifications Center</h3>
              <span className="text-[9px] text-[#c084fc] font-black tracking-widest uppercase">REAL-TIME SYSTEM ALERTS</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#8b5cf6]/20 transition-all shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Clear All Action Bar */}
        {notifications.length > 0 && (
          <div className="flex justify-between items-center mb-3 px-1">
            <span className="text-[10px] text-gray-400 font-bold">
              Total Notifications ({notifications.length})
            </span>
            <button
              onClick={onClearAll}
              className="text-[10px] text-[#00d2ff] hover:text-white font-black uppercase tracking-wider transition-all"
            >
              Clear All Alerts
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-2.5 mb-4 max-h-[50vh] overflow-y-auto pr-1">
          {notifications.length > 0 ? (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border transition-all relative ${
                  item.unread
                    ? "bg-[#070514] border-[#8b5cf6]/40 shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                    : "bg-[#070514]/60 border-white/5 opacity-80"
                }`}
              >
                {item.unread && (
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#00d2ff] animate-ping"></div>
                )}

                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-black/40 border border-white/10 shrink-0 text-xl">
                    {item.type === "bot" ? "🤖" : item.type === "launch" ? "🚀" : item.type === "reward" ? "🎁" : item.type === "cipher" ? "🔐" : "🎟️"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-white truncate pr-2">{item.title}</h4>
                      <span className="text-[9px] text-[#00d2ff] font-mono font-bold shrink-0">
                        {getRelativeTimeString(item.timestamp)}
                      </span>
                    </div>

                    <p className="text-[10px] text-gray-300 mt-1 leading-relaxed">{item.message}</p>

                    {item.actionText && (
                      <button
                        onClick={() => {
                          if (item.onAction) item.onAction();
                          onClose();
                        }}
                        className="mt-2 px-3 py-1 rounded-xl bg-[#8b5cf6]/20 hover:bg-[#8b5cf6] hover:text-white border border-[#8b5cf6]/40 text-[#c084fc] font-black text-[10px] uppercase tracking-wider transition-all"
                      >
                        {item.actionText}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-[#070514] rounded-2xl border border-white/5">
              <span className="text-3xl block mb-2 opacity-50">🔕</span>
              <p className="text-xs text-gray-400 font-bold">No new notifications at the moment.</p>
              <p className="text-[10px] text-gray-600 mt-1">Check back later for real-time mining alerts.</p>
            </div>
          )}
        </div>

        {/* 📖 DETAILED PROTOCOL GUIDE */}
        <div className="bg-[#070514]/90 p-3.5 rounded-2xl border border-[#00d2ff]/30 mb-4 space-y-1.5 text-xs">
          <p className="font-black text-[#00d2ff] uppercase flex items-center space-x-1.5 text-[11px]">
            <span>📖</span> <span>DETAILED NOTIFICATIONS PROTOCOL GUIDE</span>
          </p>
          <ul className="text-gray-300 space-y-1 text-[10px] sm:text-[11px] list-disc list-inside">
            <li>Timestamps are dynamically calculated in real-time (e.g. <strong>2m ago, 1h ago</strong>).</li>
            <li>Unread alerts display a glowing red indicator on the <strong>Header Bell 🔔</strong> icon.</li>
            <li>Click <strong>CLEAR ALL ALERTS</strong> to reset your inbox anytime.</li>
          </ul>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#8b5cf6] via-[#a855f7] to-[#00d2ff] text-white font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:opacity-90 transition-all"
        >
          Close Notifications
        </button>

      </div>
    </div>
  );
};

export default NotificationsModal;
