import { BUGDROP_THEME } from "./config";

// BugDrop renders in Shadow DOM and only exposes a few color options. Patch its shadow roots so
// the widget matches the site: the default widget (#bugdrop-host) gets white text on accent
// buttons, and each custom-flow modal ([data-bugdrop-flow], mounted on open) gets our palette
// instead of BugDrop's built-in navy dark theme.
const STYLE_MARKER = "data-bugdrop-theme";

function flowModalCss(fontFamily: string) {
  const t = BUGDROP_THEME;
  return `
    .bdv-root.bdv-dark {
      --bdv-accent: ${t.accent};
      --bdv-bg: ${t.bg};
      --bdv-bg-muted: ${t.bgMuted};
      --bdv-text: ${t.text};
      --bdv-text-muted: ${t.textMuted};
      --bdv-border: ${t.border};
      font-family: ${fontFamily};
    }
    .bdv-surface { border-radius: ${t.radius + 4}px; box-shadow: 0 24px 64px rgb(0 0 0 / 0.5); }
    .bdv-overlay { background: rgb(0 0 0 / 0.6); }

    /* Buttons: match the site's (40px, medium weight) instead of BugDrop's bold 44px. */
    .bdv-submit, .bdv-cancel, .bdv-success-link {
      min-height: 40px;
      border-radius: ${t.radius - 2}px;
      padding: 8px 16px;
      font-size: 0.875rem;
      font-weight: 500;
    }
    .bdv-cancel:hover, .bdv-success-link:hover { background: ${t.bgMuted}; }

    /* Success screen: BugDrop appends the link and Done button inline with no wrapper.
       Lay them out as a right-aligned footer row, with the link as a secondary button. */
    .bdv-surface:has(> .bdv-submit) {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
    }
    .bdv-surface:has(> .bdv-submit) > .bdv-header { flex-basis: 100%; margin-bottom: 12px; }
    .bdv-success-link {
      display: inline-flex;
      align-items: center;
      margin: 0;
      box-sizing: border-box;
      border: 1px solid var(--bdv-border);
      color: var(--bdv-text);
      text-decoration: none;
    }
    .bdv-success-link::after { content: "↗"; margin-left: 6px; color: var(--bdv-text-muted); }
  `;
}

const WIDGET_CSS = ".bd-root.bd-dark { --bd-primary-text: #ffffff; }";

function injectStyle(root: ShadowRoot | null | undefined, css: string) {
  if (!root || root.querySelector(`style[${STYLE_MARKER}]`)) return;
  const style = document.createElement("style");
  style.setAttribute(STYLE_MARKER, "");
  style.textContent = css;
  root.append(style);
}

function patchAll() {
  injectStyle(document.getElementById("bugdrop-host")?.shadowRoot, WIDGET_CSS);
  const css = flowModalCss(getComputedStyle(document.body).fontFamily);
  document.querySelectorAll<HTMLElement>("[data-bugdrop-flow]").forEach((host) => injectStyle(host.shadowRoot, css));
}

export function installThemeOverrides(): () => void {
  patchAll();
  window.addEventListener("bugdrop:ready", patchAll);
  // Flow modals are appended to <body> each time one opens.
  const observer = new MutationObserver(patchAll);
  observer.observe(document.body, { childList: true });
  return () => {
    window.removeEventListener("bugdrop:ready", patchAll);
    observer.disconnect();
  };
}
