"use client";

import type { CheckupPayload } from "@/types/lead";

const STORAGE_KEY = "joyfit_checkup_payload";

export function getStoredPayload(): Partial<CheckupPayload> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<CheckupPayload>;
    return parsed ?? {};
  } catch {
    return {};
  }
}

export function setStoredPayload(payload: Partial<CheckupPayload>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

export function clearStoredPayload() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
