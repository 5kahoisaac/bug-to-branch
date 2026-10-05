"use client";

import { useEffect, useId, useRef, useState } from "react";

import { FEEDBACK_KINDS, GROUP_LABELS, NEW_ISSUE_URL, REPORTERS } from "./config";
import {
  buildFeedbackFlow,
  buildFlowContext,
  type FeedbackFlowHandle,
  type FeedbackKind,
  type GroupLabel,
  type Reporter,
} from "./flows";
import { CheckIcon, ChevronIcon, CloseIcon, MessageIcon } from "./icons";

// Dispatched by in-page buttons (see report-feedback-button.tsx) to open this panel.
export const OPEN_FEEDBACK_EVENT = "bugdrop:open-feedback-panel";

// Module-level so React StrictMode's double effect doesn't re-register (BugDrop throws on duplicate ids).
const flowHandles = new Map<FeedbackKind, FeedbackFlowHandle>();

function registerFlows() {
  const registerFlow = window.BugDrop?.registerFlow;
  if (!registerFlow || flowHandles.size > 0) return;
  for (const { value } of FEEDBACK_KINDS) flowHandles.set(value, registerFlow(buildFeedbackFlow(value)));
}

function cx(...classes: Array<string | false>) {
  return classes.filter(Boolean).join(" ");
}

const FIELD_LABEL = "mb-2 block text-xs font-medium tracking-wide text-muted-foreground uppercase";
const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function FeedbackLauncher() {
  const titleId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [kind, setKind] = useState<FeedbackKind>("bug");
  const [reporter, setReporter] = useState<Reporter | "">("");
  const [labels, setLabels] = useState<GroupLabel[]>([]);

  useEffect(() => {
    const open = () => setIsOpen(true);
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setIsOpen(false);
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    registerFlows();
    window.addEventListener("bugdrop:ready", registerFlows);
    window.addEventListener(OPEN_FEEDBACK_EVENT, open);
    window.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => {
      window.removeEventListener("bugdrop:ready", registerFlows);
      window.removeEventListener(OPEN_FEEDBACK_EVENT, open);
      window.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsideClick);
    };
  }, []);

  function continueToFlow() {
    if (!reporter) return;
    setIsOpen(false);
    const handle = flowHandles.get(kind);
    if (!handle) {
      window.open(NEW_ISSUE_URL, "_blank", "noopener,noreferrer");
      return;
    }
    handle.open({ context: buildFlowContext(reporter, labels) });
    setLabels([]);
  }

  return (
    <div ref={containerRef} className="fixed right-5 bottom-5 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div
          role="dialog"
          aria-labelledby={titleId}
          className="w-[22rem] max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-2xl border bg-card text-sm shadow-2xl shadow-black/60"
        >
          <header className="flex items-start justify-between gap-4 px-5 pt-5">
            <div>
              <h2 id={titleId} className="text-base font-semibold">Send feedback</h2>
              <p className="mt-1 text-muted-foreground">It opens as an issue on GitHub.</p>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setIsOpen(false)}
              className={cx("-mt-1 -mr-1 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground", FOCUS_RING)}
            >
              <CloseIcon />
            </button>
          </header>

          <div className="space-y-5 px-5 py-5">
            <KindPicker value={kind} onChange={setKind} />
            <ReporterSelect value={reporter} onChange={setReporter} />
            <LabelPicker value={labels} onChange={setLabels} />
          </div>

          <footer className="flex items-center justify-end gap-2 border-t bg-background/40 px-5 py-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={cx("h-9 rounded-lg px-3 font-medium text-muted-foreground hover:bg-accent hover:text-foreground", FOCUS_RING)}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!reporter}
              onClick={continueToFlow}
              className={cx(
                "h-9 rounded-lg bg-primary px-4 font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40",
                FOCUS_RING,
              )}
            >
              Continue →
            </button>
          </footer>
        </div>
      )}

      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={cx(
          "inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 transition hover:bg-primary/90 active:translate-y-px",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
      >
        <MessageIcon />
        Feedback
      </button>
    </div>
  );
}

function KindPicker({ value, onChange }: { value: FeedbackKind; onChange: (kind: FeedbackKind) => void }) {
  return (
    <fieldset>
      <legend className={FIELD_LABEL}>Type</legend>
      <div className="grid grid-cols-3 gap-1 rounded-xl border bg-background p-1">
        {FEEDBACK_KINDS.map((entry) => (
          <label
            key={entry.value}
            className={cx(
              "flex cursor-pointer items-center justify-center gap-1.5 rounded-lg py-2 transition-colors has-focus-visible:ring-2 has-focus-visible:ring-ring",
              value === entry.value
                ? "bg-secondary text-foreground shadow-sm ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <input
              type="radio"
              name="bugdrop-feedback-kind"
              value={entry.value}
              checked={value === entry.value}
              onChange={() => onChange(entry.value)}
              className="sr-only"
            />
            <span aria-hidden>{entry.icon}</span>
            {entry.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function ReporterSelect({ value, onChange }: { value: Reporter | ""; onChange: (reporter: Reporter | "") => void }) {
  const selectId = useId();
  return (
    <div>
      <label htmlFor={selectId} className={FIELD_LABEL}>Reporter</label>
      <div className="relative">
        <select
          id={selectId}
          required
          value={value}
          onChange={(event) => onChange(event.target.value as Reporter | "")}
          className={cx(
            "h-10 w-full cursor-pointer appearance-none rounded-lg border border-input bg-background pr-9 pl-3 hover:border-muted-foreground/50",
            FOCUS_RING,
            value === "" && "text-muted-foreground",
          )}
        >
          <option value="" disabled>
            Who is reporting?
          </option>
          {REPORTERS.map((name) => (
            <option key={name} value={name} className="text-foreground">
              {name}
            </option>
          ))}
        </select>
        <ChevronIcon className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
  );
}

function LabelPicker({ value, onChange }: { value: GroupLabel[]; onChange: (labels: GroupLabel[]) => void }) {
  const toggle = (name: GroupLabel) =>
    onChange(value.includes(name) ? value.filter((label) => label !== name) : [...value, name]);
  return (
    <fieldset>
      <legend className={FIELD_LABEL}>
        Labels <span className="tracking-normal normal-case">(optional)</span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {GROUP_LABELS.map(({ name, description }) => {
          const isSelected = value.includes(name);
          return (
            <label
              key={name}
              title={description}
              className={cx(
                "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border px-3 transition-colors has-focus-visible:ring-2 has-focus-visible:ring-ring",
                isSelected
                  ? "border-primary/60 bg-primary/15 text-foreground"
                  : "text-muted-foreground hover:border-input hover:text-foreground",
              )}
            >
              <input type="checkbox" checked={isSelected} onChange={() => toggle(name)} className="sr-only" />
              {isSelected && <CheckIcon />}
              {name}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
