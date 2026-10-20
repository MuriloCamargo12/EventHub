"use client";

import { useEffect, useRef, useState } from "react";

const ERROR_VISIBLE_MS = 2000;

export function useNotice() {
  const [notice, setNotice] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function clearTimer() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }

  function clearNotice() {
    clearTimer();
    setNotice("");
  }

  function showNotice(message: string) {
    clearTimer();
    setNotice(message);
  }

  function showError(message: string) {
    clearTimer();
    setNotice(message);
    timer.current = setTimeout(() => setNotice(""), ERROR_VISIBLE_MS);
  }

  return { notice, showNotice, showError, clearNotice };
}
