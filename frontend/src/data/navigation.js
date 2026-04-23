import {
  LayoutDashboard,
  CalendarPlus,
  CalendarCheck,
  Bell,
  Users,
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
    { label: "Manage Bookings", path: "/admin/bookings", icon: CalendarCheck },
    { label: "Users & Roles", path: "/admin/users", icon: Users },
    { label: "Notifications", path: "/notifications", icon: Bell },
  ],
};
