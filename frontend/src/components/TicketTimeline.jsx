import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getTicketHistory } from "../services/ticketService";
import {
  CheckCircle2,
  Clock3,
  Paperclip,
  UserCheck,
  MessageSquare,
  RefreshCcw,
} from "lucide-react";

function getIcon(action) {
  switch (action) {
    case "CREATED":
      return CheckCircle2;
    case "ATTACHMENT_ADDED":
      return Paperclip;
    case "ASSIGNED":
      return UserCheck;
    case "ADMIN_NOTE":
    case "TECHNICIAN_NOTE":
      return MessageSquare;
    default:
      return RefreshCcw;
  }
}

function TicketTimeline({ ticketId }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getTicketHistory(ticketId);
        setHistory(data);
      } catch {
        toast.error("Failed to load ticket timeline");
      }
    };

    if (ticketId) {
      loadHistory();
    }
  }, [ticketId]);

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-800/70">
      <h4 className="mb-4 text-sm font-bold text-slate-700 dark:text-slate-200">
        Ticket Timeline
      </h4>

      <div className="space-y-4">
        {history.map((item) => {
          const Icon = getIcon(item.action);

          return (
            <div key={item.id} className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
                <Icon size={16} />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white">
                  {item.action.replaceAll("_", " ")}
                </p>

                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {item.message}
                </p>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span>{item.updatedBy || "System"}</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock3 size={11} />
                    {item.createdAt?.replace("T", " ").slice(0, 16)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TicketTimeline;