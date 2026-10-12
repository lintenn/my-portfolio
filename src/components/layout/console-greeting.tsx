"use client";

import { useEffect } from "react";
import { site } from "@/content/site";

let greeted = false;

/** A small hello for the curious ones who open DevTools. */
export function ConsoleGreeting() {
  useEffect(() => {
    if (greeted) return;
    greeted = true;
    console.log(
      "%c👋 Hey, fellow developer!%c\nCurious how this works? The whole code (and the docs) are here → " +
        site.repo,
      "font-size:16px;font-weight:700;background:linear-gradient(90deg,#c084fc,#818cf8,#60a5fa);color:white;padding:6px 10px;border-radius:8px",
      "font-size:12px;color:inherit",
    );
  }, []);
  return null;
}
