// 4-step checkup wizard payload (no email / no lead capture)

export type GenderOption = "male" | "female" | "other";
export type ActivityLevelOption = "sedentary" | "light" | "moderate" | "active";

export interface Checkup5Payload {
  // Step 1 – Body
  currentWeightKg?: number;
  goalWeightKg?: number;
  heightCm: number; // required for nutrition baseline
  gender?: GenderOption;
  age?: number;
  // Step 2 – Community
  priorCommunityProgram?: boolean;
  // Step 3 – Rewards
  priorRewardSystem?: boolean;
  // Step 4 – Lifestyle
  mealsPerDay?: number;
  activityLevel?: ActivityLevelOption;
}

export const ACTIVITY_OPTIONS: { value: ActivityLevelOption; label: string }[] = [
  { value: "sedentary", label: "Сууж ажилладаг" },
  { value: "light", label: "Бага зэргийн хөдөлгөөн" },
  { value: "moderate", label: "Дунд зэргийн идэвхтэй" },
  { value: "active", label: "Маш идэвхтэй" },
];
