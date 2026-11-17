import { brokeredPreviewStorage, type PreviewAuthStorage } from "./previewAuthStorage";

const REMEMBER_KEY = "futuroute:remember-session";

/** "Remember me" is on by default, which matches the previous always-persistent behaviour. */
export function isRememberSession(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return localStorage.getItem(REMEMBER_KEY) !== "0";
  } catch {
    return true;
  }
}

/**
 * Called by the sign-in form before authenticating. When the box is ticked the
 * session is kept in localStorage (survives closing the browser); when it is not,
 * the session lives in sessionStorage and ends with the tab.
 */
export function setRememberSession(remember: boolean) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(REMEMBER_KEY, remember ? "1" : "0");
  } catch {
    /* storage blocked: fall back to the default (persistent) behaviour */
  }
}

/**
 * Supabase auth storage that honours the "remember me" choice. Everything else
 * (the editor session broker used by the Lovable preview) is unchanged.
 */
export function rememberAwareStorage(): PreviewAuthStorage | undefined {
  const base = brokeredPreviewStorage();
  if (!base || typeof window === "undefined") return base;

  const session = () => {
    try {
      return window.sessionStorage;
    } catch {
      return undefined;
    }
  };

  return {
    getItem: (key) => {
      if (isRememberSession()) return base.getItem(key);
      return session()?.getItem(key) ?? null;
    },
    setItem: (key, value) => {
      if (isRememberSession()) {
        session()?.removeItem(key);
        return base.setItem(key, value);
      }
      try {
        session()?.setItem(key, value);
      } catch {
        /* storage full: the session still lives in memory for this tab */
      }
      return base.removeItem(key);
    },
    removeItem: (key) => {
      session()?.removeItem(key);
      return base.removeItem(key);
    },
  };
}
