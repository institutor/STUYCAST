"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "stuycast-simple-mode";

interface SimpleModeContextValue {
  simple: boolean;
  toggle: () => void;
}

const SimpleModeContext = createContext<SimpleModeContextValue>({
  simple: false,
  toggle: () => {},
});

export function SimpleModeProvider({ children }: { children: React.ReactNode }) {
  const [simple, setSimple] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) === "1";
      setSimple(stored);
      if (stored) document.body.classList.add("simple-mode");
    } catch {
      // ignore
    }
  }, []);

  const toggle = useCallback(() => {
    setSimple((prev) => {
      const next = !prev;
      try {
        if (next) {
          localStorage.setItem(STORAGE_KEY, "1");
          document.body.classList.add("simple-mode");
        } else {
          localStorage.removeItem(STORAGE_KEY);
          document.body.classList.remove("simple-mode");
        }
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return (
    <SimpleModeContext.Provider value={{ simple, toggle }}>
      {children}
    </SimpleModeContext.Provider>
  );
}

export function useSimpleMode() {
  return useContext(SimpleModeContext);
}
