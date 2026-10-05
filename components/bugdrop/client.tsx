"use client";

import { useEffect } from "react";

import { installDescriptionFix } from "./description-fix";
import { FeedbackLauncher } from "./feedback-launcher";
import { installThemeOverrides } from "./theme";

export function BugDropClient() {
  useEffect(() => {
    installDescriptionFix();
    return installThemeOverrides();
  }, []);

  return <FeedbackLauncher />;
}
