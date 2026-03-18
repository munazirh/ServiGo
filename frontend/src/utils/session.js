const THEME_STORAGE_KEY = "theme";
const AUTH_SESSION_KEY = "servigo_session_active";

export function parseStoredUser() {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function clearSessionPreserveTheme() {
  const preservedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const keys = Object.keys(localStorage);

  keys.forEach((key) => {
    if (key !== THEME_STORAGE_KEY) {
      localStorage.removeItem(key);
    }
  });

  if (preservedTheme === "light" || preservedTheme === "dark") {
    localStorage.setItem(THEME_STORAGE_KEY, preservedTheme);
  }

  sessionStorage.removeItem(AUTH_SESSION_KEY);
}

export function setAuthSession(token, user) {
  if (!token || !user) return;
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  sessionStorage.setItem(AUTH_SESSION_KEY, "1");
}

export function bootstrapAuthSession() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const hasActiveBrowserSession = sessionStorage.getItem(AUTH_SESSION_KEY) === "1";
  if (hasActiveBrowserSession) return;

  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
