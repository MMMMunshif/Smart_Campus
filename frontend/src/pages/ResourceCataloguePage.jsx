import { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { getAllResources } from "../services/resourceService";
import toast from "react-hot-toast";
import {
  Building2,
  MapPin,
  Users,
  Search,
  ShieldCheck,
  Wrench,
  CalendarCheck,
  RefreshCcw,
  CheckCircle2,
  XCircle,
  ChevronDown,
  SlidersHorizontal,
  Zap,
  Grid3X3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const C = {
  accent: "#00F5FF",
  accentDim: "#00C8D4",
  accentGlow: "rgba(0,245,255,0.18)",
  accentGlow2: "rgba(0,245,255,0.07)",
  glass: "rgba(255,255,255,0.04)",
  glassBorder: "rgba(255,255,255,0.10)",
  glassBorderHover: "rgba(0,245,255,0.40)",
  bg: "#080C10",
  surface: "#0D1117",
  textPrimary: "#F0F6FF",
  textMuted: "#6B7A8D",
  textFaint: "#2E3A47",
};

const glassBase = {
  background: C.glass,
  border: `1px solid ${C.glassBorder}`,
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
};

function StatusBadge({ status }) {
  const cfg =
    {
      AVAILABLE: {
        color: "#00F5FF",
        bg: "rgba(0,245,255,0.10)",
        border: "rgba(0,245,255,0.30)",
      },
      UNAVAILABLE: {
        color: "#FF4C6A",
        bg: "rgba(255,76,106,0.10)",
        border: "rgba(255,76,106,0.30)",
      },
      MAINTENANCE: {
        color: "#FFAE00",
        bg: "rgba(255,174,0,0.10)",
        border: "rgba(255,174,0,0.30)",
      },
    }[status] ?? {
      color: "#6B7A8D",
      bg: "rgba(107,122,141,0.10)",
      border: "rgba(107,122,141,0.30)",
    };

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-widest uppercase"
      style={{
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full animate-pulse"
        style={{ background: cfg.color, boxShadow: `0 0 6px ${cfg.color}` }}
      />
      {status || "UNKNOWN"}
    </span>
  );
}

function StatCard({ label, value }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="relative overflow-hidden rounded-3xl p-6 transition-all duration-300"
      style={{
        ...glassBase,
        boxShadow: hov
          ? `0 0 32px ${C.accentGlow}, 0 8px 32px rgba(0,0,0,0.6)`
          : "none",
        border: hov ? `1px solid ${C.glassBorderHover}` : `1px solid ${C.glassBorder}`,
      }}
    >
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl"
        style={{ background: C.accentGlow, opacity: hov ? 1 : 0.4 }}
      />
      <p
        className="text-xs font-semibold uppercase tracking-[0.15em]"
        style={{ color: C.textMuted }}
      >
        {label}
      </p>
      <h3 className="mt-3 text-4xl font-black tabular-nums" style={{ color: C.accent }}>
        {value}
      </h3>
    </div>
  );
}

function ResourceCard({ resource, onBook, currentUserType }) {
  const [hov, setHov] = useState(false);
  const available = resource.availabilityStatus === "AVAILABLE";

  const allowed = (resource.allowedUserType || "ALL").toUpperCase();
  const bookableForUser =
    allowed === "ALL" || allowed === currentUserType || currentUserType === "ADMIN";

  const infoItems = [
    { Icon: MapPin, color: C.accent, label: resource.location || "No location" },
    { Icon: Users, color: C.accent, label: `Cap: ${resource.capacity || 0}` },
    { Icon: ShieldCheck, color: C.accentDim, label: resource.allowedUserType || "ALL" },
    {
      Icon: available
        ? CheckCircle2
        : resource.availabilityStatus === "MAINTENANCE"
        ? Wrench
        : XCircle,
      color:
        available
          ? "#00F5FF"
          : resource.availabilityStatus === "MAINTENANCE"
          ? "#FFAE00"
          : "#FF4C6A",
      label:
        available
          ? "Ready to book"
          : resource.availabilityStatus === "MAINTENANCE"
          ? "Under maintenance"
          : "Unavailable",
    },
  ];

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="relative flex flex-col overflow-hidden rounded-3xl transition-all duration-300"
      style={{
        ...glassBase,
        border: hov ? `1px solid ${C.glassBorderHover}` : `1px solid ${C.glassBorder}`,
        boxShadow: hov
          ? `0 0 40px ${C.accentGlow}, 0 12px 40px rgba(0,0,0,0.7)`
          : "0 2px 12px rgba(0,0,0,0.3)",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      <div
        className="h-px w-full transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${C.accent} 50%, transparent 100%)`,
          opacity: hov ? 1 : 0,
        }}
      />

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-4 min-w-0">
            <div
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl"
              style={{
                background: hov ? "rgba(0,245,255,0.12)" : "rgba(0,245,255,0.06)",
                border: `1px solid ${hov ? C.accent : "rgba(0,245,255,0.18)"}`,
                boxShadow: hov ? `0 0 20px ${C.accentGlow}` : "none",
              }}
            >
              <Building2 size={20} style={{ color: C.accent }} />
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-base font-bold" style={{ color: C.textPrimary }}>
                {resource.resourceName}
              </h3>
              <p
                className="mt-0.5 text-xs font-medium uppercase tracking-widest"
                style={{ color: C.textMuted }}
              >
                {resource.resourceType}
              </p>
            </div>
          </div>

          <StatusBadge status={resource.availabilityStatus} />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {infoItems.map(({ Icon, color, label }, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 rounded-2xl p-3"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <Icon size={13} style={{ color, flexShrink: 0 }} />
              <span className="truncate text-xs font-medium" style={{ color: C.textMuted }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {resource.description && (
          <p className="mt-4 line-clamp-2 text-sm leading-relaxed" style={{ color: C.textMuted }}>
            {resource.description}
          </p>
        )}

        <div className="mt-5">
          {available && bookableForUser ? (
            <button
              onClick={() => onBook(resource)}
              className="w-full rounded-2xl py-3 text-sm font-bold tracking-wide transition-all duration-300"
              style={{
                background: hov ? "rgba(0,245,255,0.14)" : "rgba(0,245,255,0.07)",
                border: `1px solid ${hov ? C.accent : "rgba(0,245,255,0.22)"}`,
                color: C.accent,
                boxShadow: hov ? `0 0 24px ${C.accentGlow}` : "none",
              }}
            >
              <span className="flex items-center justify-center gap-2">
                <CalendarCheck size={15} /> Book Now
              </span>
            </button>
          ) : (
            <button
              disabled
              className="w-full rounded-2xl py-3 text-sm font-semibold cursor-not-allowed"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.05)",
                color: C.textFaint,
              }}
            >
              {available ? "Not allowed for your account" : "Not Available"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ResourceCataloguePage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const navigate = useNavigate();
  const { user } = useAuth();

  const currentUserType = (user?.userType || "").toUpperCase();

  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await getAllResources();

      if (!Array.isArray(data)) {
        console.error("Invalid resources response:", data);
        setResources([]);
        toast.error("Invalid resources response");
        return;
      }

      setResources(data);
    } catch (error) {
      console.error("Failed to load resources:", error);
      toast.error("Failed to load resources");
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const filteredResources = useMemo(() => {
    let data = [...resources];

    if (search.trim()) {
      const kw = search.toLowerCase();
      data = data.filter(
        (r) =>
          r.resourceName?.toLowerCase().includes(kw) ||
          r.location?.toLowerCase().includes(kw) ||
          r.resourceType?.toLowerCase().includes(kw)
      );
    }

    if (typeFilter !== "ALL") {
      data = data.filter((r) => r.resourceType === typeFilter);
    }

    if (statusFilter !== "ALL") {
      data = data.filter((r) => r.availabilityStatus === statusFilter);
    }

    return data;
  }, [search, typeFilter, statusFilter, resources]);

  const resourceTypes = useMemo(() => {
    const types = resources.map((r) => r.resourceType).filter(Boolean);
    return ["ALL", ...new Set(types)];
  }, [resources]);

  const stats = useMemo(
    () => ({
      total: resources.length,
      available: resources.filter((r) => r.availabilityStatus === "AVAILABLE").length,
      maintenance: resources.filter((r) => r.availabilityStatus === "MAINTENANCE").length,
      unavailable: resources.filter((r) => r.availabilityStatus === "UNAVAILABLE").length,
    }),
    [resources]
  );

  const goBooking = (resource) => {
    navigate(
      `/bookings/new?resourceId=${encodeURIComponent(resource.id)}&resource=${encodeURIComponent(
        resource.resourceName
      )}`
    );
  };

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("ALL");
    setStatusFilter("ALL");
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${C.glassBorder}`,
    color: C.textPrimary,
    borderRadius: "1rem",
    padding: "0.75rem 1rem",
    fontSize: "0.875rem",
    outline: "none",
    width: "100%",
    transition: "border 0.2s, box-shadow 0.2s",
  };

  return (
    <AppLayout title="Browse Resources">
      <div style={{ background: C.bg }} className="min-h-screen">
        <div className="max-w-7xl space-y-7 px-1 py-2">
          <div
            className="relative overflow-hidden rounded-[2rem] p-10"
            style={{
              background: `linear-gradient(135deg, ${C.surface} 0%, #0A1520 100%)`,
              border: `1px solid ${C.glassBorder}`,
              boxShadow:
                "0 0 80px rgba(0,245,255,0.05), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full blur-3xl"
              style={{ background: "rgba(0,245,255,0.07)" }}
            />
            <div
              className="pointer-events-none absolute -left-10 bottom-0 h-48 w-48 rounded-full blur-3xl"
              style={{ background: "rgba(0,245,255,0.04)" }}
            />

            <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
              <div>
                <div
                  className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em]"
                  style={{
                    background: "rgba(0,245,255,0.08)",
                    border: "1px solid rgba(0,245,255,0.22)",
                    color: C.accent,
                  }}
                >
                  <Zap size={11} /> Campus Facilities
                </div>

                <h1
                  className="text-4xl font-black tracking-tight xl:text-5xl leading-tight"
                  style={{ color: C.textPrimary }}
                >
                  Resource{" "}
                  <span style={{ color: C.accent, textShadow: `0 0 32px ${C.accentGlow}` }}>
                    Catalogue
                  </span>
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7" style={{ color: C.textMuted }}>
                  Browse lecture halls, laboratories, meeting rooms, auditoriums, and campus
                  equipment before placing a booking request.
                </p>
              </div>

              <div className="flex gap-3 flex-shrink-0">
                {[
                  { val: stats.total, lbl: "Total" },
                  { val: stats.available, lbl: "Live" },
                ].map(({ val, lbl }) => (
                  <div
                    key={lbl}
                    className="rounded-2xl px-6 py-4 text-center"
                    style={{
                      background: "rgba(0,245,255,0.06)",
                      border: "1px solid rgba(0,245,255,0.14)",
                    }}
                  >
                    <p className="text-3xl font-black tabular-nums" style={{ color: C.accent }}>
                      {val}
                    </p>
                    <p
                      className="mt-1 text-xs font-semibold uppercase tracking-widest"
                      style={{ color: C.textMuted }}
                    >
                      {lbl}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: "Total", value: stats.total },
              { label: "Available", value: stats.available },
              { label: "Maintenance", value: stats.maintenance },
              { label: "Unavailable", value: stats.unavailable },
            ].map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>

          <div
            className="rounded-[2rem] p-7"
            style={{ ...glassBase, boxShadow: "0 4px 32px rgba(0,0,0,0.5)" }}
          >
            <div className="mb-5 flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  background: "rgba(0,245,255,0.08)",
                  border: "1px solid rgba(0,245,255,0.20)",
                }}
              >
                <SlidersHorizontal size={16} style={{ color: C.accent }} />
              </div>

              <div>
                <h2 className="text-base font-bold" style={{ color: C.textPrimary }}>
                  Search & Filter
                </h2>
                <p className="text-xs" style={{ color: C.textMuted }}>
                  Find the right resource instantly
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
              <div className="relative lg:col-span-2">
                <Search
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: C.textMuted }}
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, type or location..."
                  style={{ ...inputStyle, paddingLeft: "2.75rem" }}
                />
              </div>

              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  style={{
                    ...inputStyle,
                    paddingRight: "2.5rem",
                    appearance: "none",
                    cursor: "pointer",
                  }}
                >
                  {resourceTypes.map((t) => (
                    <option key={t} value={t} style={{ background: C.surface }}>
                      {t === "ALL" ? "All Types" : t}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: C.textMuted }}
                />
              </div>

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    ...inputStyle,
                    paddingRight: "2.5rem",
                    appearance: "none",
                    cursor: "pointer",
                  }}
                >
                  {["ALL", "AVAILABLE", "MAINTENANCE", "UNAVAILABLE"].map((s) => (
                    <option key={s} value={s} style={{ background: C.surface }}>
                      {s === "ALL" ? "All Status" : s}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: C.textMuted }}
                />
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={loadResources}
                className="inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold transition-all duration-200 hover:opacity-75"
                style={{
                  background: "rgba(0,245,255,0.10)",
                  border: "1px solid rgba(0,245,255,0.28)",
                  color: C.accent,
                }}
              >
                <RefreshCcw size={14} /> Refresh
              </button>

              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:opacity-75"
                style={{
                  background: C.glass,
                  border: `1px solid ${C.glassBorder}`,
                  color: C.textMuted,
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 animate-pulse rounded-3xl"
                  style={{ background: C.glass, border: `1px solid ${C.glassBorder}` }}
                />
              ))}
            </div>
          ) : filteredResources.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center rounded-[2rem] py-20 text-center"
              style={{ ...glassBase }}
            >
              <div
                className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{
                  background: "rgba(0,245,255,0.08)",
                  border: "1px solid rgba(0,245,255,0.20)",
                  boxShadow: `0 0 24px ${C.accentGlow}`,
                }}
              >
                <Building2 size={26} style={{ color: C.accent }} />
              </div>
              <h3 className="text-xl font-bold" style={{ color: C.textPrimary }}>
                No Resources Found
              </h3>
              <p className="mt-2 text-sm" style={{ color: C.textMuted }}>
                Try a different search keyword or filter.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Grid3X3 size={13} style={{ color: C.textMuted }} />
                <p className="text-sm" style={{ color: C.textMuted }}>
                  Showing{" "}
                  <span style={{ color: C.accent, fontWeight: 700 }}>
                    {filteredResources.length}
                  </span>{" "}
                  resource{filteredResources.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {filteredResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onBook={goBooking}
                    currentUserType={currentUserType}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default ResourceCataloguePage;