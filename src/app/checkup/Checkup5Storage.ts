"use client";

import type { Checkup5Payload } from "@/types/checkup5";

const STORAGE_KEY = "joyfit_checkup_5_payload";
const STEP_KEY = "joyfit_checkup_5_step";
const TOTAL_STEPS = 4;

export function getStoredPayload(): Partial<Checkup5Payload> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<Checkup5Payload>;
    return parsed ?? {};
  } catch {
    return {};
  }
}

export function setStoredPayload(payload: Partial<Checkup5Payload>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

export function getStoredStep(): number {
  if (typeof window === "undefined") return 1;
  try {
    const raw = localStorage.getItem(STEP_KEY);
    if (raw == null) return 1;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n >= 1 && n <= TOTAL_STEPS ? n : 1;
  } catch {
    return 1;
  }
}

export function setStoredStep(step: number) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STEP_KEY, String(step));
  } catch {
    // ignore
  }
}

export function clearCheckup5Storage() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STEP_KEY);
  } catch {
    // ignore
  }
}
