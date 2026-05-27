// Module-level ref so apiFetch can trigger logout without React context.
// AuthContext registers its logout fn here on mount; apiFetch calls it on 401.
let _logout: (() => void) | null = null;

export const registerLogout = (fn: () => void) => {
  _logout = fn;
};

export const triggerLogout = () => {
  _logout?.();
};
