const AUTH_STORAGE_KEY = "smart_campus_auth";
const SUPPORTED_ROLES = ["USER", "ADMIN"];

export const saveAuth = (payload) => {
  const authData = {
    token: payload.token,
    tokenType: payload.tokenType || "Bearer",
    role: payload.role,
    email: payload.email,
    name: payload.name,
    username: payload.username,
    profileImageUrl: payload.profileImageUrl || null,
  };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
};

export const getAuth = () => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const getAuthToken = () => {
  const auth = getAuth();
  return auth?.token || null;
};

export const isAuthenticated = () => !!getAuthToken();
export const isRoleSupported = (role) => SUPPORTED_ROLES.includes(role);

export const clearAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const getDefaultPathByRole = (role) => {
  if (role === "ADMIN") return "/admin/dashboard";
  return "/dashboard";
};
