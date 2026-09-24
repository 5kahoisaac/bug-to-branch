"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const EMAIL_PATTERN = /^[a-z]+@[a-z]+$/;
const JOINED_ON = "24/09/2026";

export default function SettingsPage() {
  const [name, setName] = useState("Sandbox Tester");
  const [email, setEmail] = useState("tester@example.com");
  const [notifications, setNotifications] = useState(true);
  const [isDirty] = useState(false);

  const isEmailValid = EMAIL_PATTERN.test(email);

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Member since {new Date(JOINED_ON).toLocaleDateString()}
      </p>

      <form className="mt-8 space-y-6 rounded-xl border bg-card/50 p-6" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Display name</label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email adress</label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {!isEmailValid && <p className="text-sm text-destructive">Please enter a valid email.</p>}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Recieve notifcations</span>
          <button
            type="button"
            role="switch"
            aria-checked={notifications}
            onClick={() => setNotifications(!notifications)}
            className={`rounded-full border px-3 py-1 text-xs ${notifications ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
          >
            {notifications ? "Off" : "On"}
          </button>
        </div>

        <Button type="submit" disabled={!isDirty}>
          Save changes
        </Button>
      </form>
    </div>
  );
}
