"use client";

import { useEffect } from "react";

// BugDrop's dark theme hardcodes dark text on the accent color and has no
// data-* option for it. Patch its shadow root so buttons match ours (white on indigo).
const OVERRIDE_CSS = ".bd-root.bd-dark { --bd-primary-text: #ffffff; }";

function applyOverride() {
  const root = document.getElementById("bugdrop-host")?.shadowRoot;
  if (!root || root.querySelector("style[data-bugdrop-theme]")) return;
  const style = document.createElement("style");
  style.dataset.bugdropTheme = "";
  style.textContent = OVERRIDE_CSS;
  root.append(style);
}

export function BugDropTheme() {
  useEffect(() => {
    applyOverride();
    window.addEventListener("bugdrop:ready", applyOverride);
    return () => window.removeEventListener("bugdrop:ready", applyOverride);
  }, []);

  return null;
}
