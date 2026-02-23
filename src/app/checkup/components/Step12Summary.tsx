"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { CheckupPayload } from "@/types/lead";
import { STEP_7_OPTIONS, STEP_10_OPTIONS } from "@/types/lead";
import { StepLayout } from "./StepLayout";

const LEAD_ID_KEY = "joyfit_last_lead_id";

interface Props {
  payload: Partial<CheckupPayload>;
  onBack: () => void;
}

export function Step12Summary({ payload, onBack }: Props) {
  const [leadId, setLeadId] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setLeadId(localStorage.getItem(LEAD_ID_KEY));
    }
  }, []);
  const current = payload.current_weight_kg;
  const goal = payload.goal_weight_kg;
  const gap =
    typeof current === "number" &&
    typeof goal === "number" &&
    goal < current
      ? (current - goal).toFixed(1)
      : null;
  const timeline = payload.timeline_weeks;
  const commitment = payload.commitment;
  const community = payload.community_preference;
  const activityLabel =
    payload.activity_level &&
    STEP_7_OPTIONS.find((o) => o.value === payload.activity_level)?.label;
  const motivationLabel =
    payload.motivation &&
    STEP_10_OPTIONS.find((o) => o.value === payload.motivation)?.label;

  return (
    <StepLayout
      step={12}
      title="Таны өөрчлөлтийн төлөвлөгөө"
      helper="Энэ бол таны шийдэлд хүрэх эхлэл."
      onBack={onBack}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <span className="text-sm text-gray-500">Одоогийн жин</span>
            <p className="font-semibold text-gray-900 mt-0.5">
              {current != null ? `${current} кг` : "—"}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <span className="text-sm text-gray-500">Зорилтот жин</span>
            <p className="font-semibold text-gray-900 mt-0.5">
              {goal != null ? `${goal} кг` : "—"}
            </p>
          </div>
          {gap != null && (
            <div className="col-span-2 bg-emerald-50 rounded-xl border border-emerald-100 p-4">
              <span className="text-sm text-emerald-700">Зорилтын зөрүү</span>
              <p className="font-bold text-emerald-700 text-lg mt-0.5">
                {gap} кг хасах — та үүнийг хийж чадна.
              </p>
            </div>
          )}
        </div>
        <div className="space-y-2 text-sm">
          {timeline != null && (
            <p>
              <span className="text-gray-500">Хугацаа: </span>
              <strong className="text-gray-900">{timeline} долоо хоног</strong>
            </p>
          )}
          {commitment && (
            <p>
              <span className="text-gray-500">Амлалт: </span>
              <strong className="text-gray-900">
                {commitment === "yes"
                  ? "Тийм"
                  : commitment === "maybe"
                    ? "Магадгүй"
                    : "Үгүй"}
              </strong>
            </p>
          )}
          {community && (
            <p>
              <span className="text-gray-500">Нийгэмлэг: </span>
              <strong className="text-gray-900">
                {community === "community"
                  ? "Багийн дэмжлэгтэй"
                  : "Ганцаараа"}
              </strong>
            </p>
          )}
          {activityLabel && (
            <p>
              <span className="text-gray-500">Идэвх: </span>
              <strong className="text-gray-900">{activityLabel}</strong>
            </p>
          )}
          {motivationLabel && (
            <p>
              <span className="text-gray-500">Урам: </span>
              <strong className="text-gray-900">{motivationLabel}</strong>
            </p>
          )}
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-100">
          <p className="text-sm font-medium text-emerald-800 mb-2">
            Хүлээгдэж буй дэвшил
          </p>
          <div className="h-20 flex items-end gap-1">
            {[0.2, 0.4, 0.55, 0.7, 0.82, 0.9, 1].map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-emerald-600 opacity-90 transition-all duration-300"
                style={{ height: `${v * 100}%` }}
              />
            ))}
          </div>
          <p className="text-xs text-emerald-700 mt-2">
            Долоо хоног бүр жингээ оруулбал ийм хэлбэрт ойртоно.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href={leadId ? `/payment?leadId=${encodeURIComponent(leadId)}` : "/payment"}
            className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-xl shadow-md transition-all duration-200"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.dispatchEvent(
                  new CustomEvent("joyfit:onboarding:complete", { detail: { step: 12 } })
                );
              }
            }}
          >
            Хөтөлбөрт нэгдэх (89,000₮)
          </Link>
          <button
            type="button"
            onClick={onBack}
            className="w-full border-2 border-gray-300 text-gray-800 font-medium rounded-xl py-4 hover:bg-gray-50 transition-all duration-200"
          >
            Буцах
          </button>
        </div>
      </div>
    </StepLayout>
  );
}
