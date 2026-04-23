import {
  LayoutDashboard,
  CalendarPlus,
  CalendarCheck,
  Building2,
  Wrench,
  Bell,
  Users,
  ClipboardList,
} from "lucide-react";

export const navigationByRole = {
  USER: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "New Booking", path: "/bookings/new", icon: CalendarPlus },
    { label: "My Bookings", path: "/bookings/my", icon: CalendarCheck },
    { label: "Notifications", path: "/notifications", icon: Bell },
  ],

  ADMIN: [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Manage Resources", path: "/admin/resources", icon: Building2 },
    { label: "Manage Bookings", path: "/admin/bookings", icon: CalendarCheck },
    { label: "Manage Tickets", path: "/admin/tickets", icon: Wrench },
    { label: "Users & Roles", path: "/admin/users", icon: Users },
    { label: "Notifications", path: "/notifications", icon: Bell },
  ],

  TECHNICIAN: [
    { label: "Dashboard", path: "/technician/dashboard", icon: LayoutDashboard },
    { label: "Assigned Tickets", path: "/technician/tickets", icon: ClipboardList },
    { label: "Notifications", path: "/notifications", icon: Bell },
  ],
};