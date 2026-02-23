// Onboarding wizard payload (all steps)

export type Gender = "male" | "female";

export type EmotionalGap =
  | "now"
  | "3_6_months"
  | "1_year"
  | "dont_remember";

export type PastAttempts =
  | "many_times_gained_back"
  | "once"
  | "first_time";

export type CommunityPreference = "solo" | "community";

export type RewardBuyIn = "yes" | "no";

export type ActivityLevel =
  | "sedentary"
  | "light_walk"
  | "exercise_1_3_weekly"
  | "active_daily";

export type Commitment = "yes" | "maybe" | "no";

export type Motivation =
  | "trip"
  | "wedding"
  | "competition"
  | "family_event"
  | "for_myself";

export interface CheckupPayload {
  // Step 1
  current_weight_kg?: number;
  goal_weight_kg?: number;
  age?: number;
  gender?: Gender;

  // Step 2
  emotional_gap?: EmotionalGap;

  // Step 3
  past_attempts?: PastAttempts;

  // Step 4
  community_preference?: CommunityPreference;

  // Step 5
  reward_buy_in?: RewardBuyIn;

  // Step 6
  meals_per_day?: number;

  // Step 7
  activity_level?: ActivityLevel;

  // Step 8
  commitment?: Commitment;

  // Step 9
  timeline_weeks?: number;

  // Step 10
  motivation?: Motivation;

  // Step 11
  email?: string;
  consent?: boolean;
}

export const STEP_1_FIELDS = ["current_weight_kg", "goal_weight_kg", "age", "gender"] as const;
export const STEP_2_OPTIONS: { value: EmotionalGap; label: string }[] = [
  { value: "now", label: "Одоогоор" },
  { value: "3_6_months", label: "3–6 сарын өмнө" },
  { value: "1_year", label: "1 жилийн өмнө" },
  { value: "dont_remember", label: "Санахгүй байна" },
];
export const STEP_3_OPTIONS: { value: PastAttempts; label: string }[] = [
  { value: "many_times_gained_back", label: "Олон удаа оролдсон ч буцаад нэмэгдсэн" },
  { value: "once", label: "Нэг удаа оролдсон" },
  { value: "first_time", label: "Анх удаа эхэлж байна" },
];
export const STEP_4_OPTIONS: { value: CommunityPreference; label: string }[] = [
  { value: "solo", label: "Ганцаараа" },
  { value: "community", label: "Багийн дэмжлэгтэй (Leaderboard + Stars)" },
];
export const STEP_5_OPTIONS: { value: RewardBuyIn; label: string }[] = [
  { value: "yes", label: "Тийм" },
  { value: "no", label: "Үгүй" },
];
export const STEP_7_OPTIONS: { value: ActivityLevel; label: string }[] = [
  { value: "sedentary", label: "Сууж ажилладаг" },
  { value: "light_walk", label: "Бага зэргийн алхалт" },
  { value: "exercise_1_3_weekly", label: "7 хоногт 1–3 удаа дасгал" },
  { value: "active_daily", label: "Өдөр бүр идэвхтэй" },
];
export const STEP_8_OPTIONS: { value: Commitment; label: string }[] = [
  { value: "yes", label: "Тийм" },
  { value: "maybe", label: "Магадгүй" },
  { value: "no", label: "Үгүй" },
];
export const STEP_9_OPTIONS = [4, 8, 12] as const;
export const STEP_10_OPTIONS: { value: Motivation; label: string }[] = [
  { value: "trip", label: "Аялал" },
  { value: "wedding", label: "Хурим" },
  { value: "competition", label: "Тэмцээн" },
  { value: "family_event", label: "Гэр бүлийн арга хэмжээ" },
  { value: "for_myself", label: "Өөрийнхөө төлөө" },
];
