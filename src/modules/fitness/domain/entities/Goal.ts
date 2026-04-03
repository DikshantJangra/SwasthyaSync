import { Nutrients } from "./Nutrition";

export interface Goal {
  id: string;
  userId: string;
  type: "nutrition" | "workout" | "weight" | "custom";
  goalDate?: Date; // Timeline-specific goal
  targetNutrients?: Nutrients;
  targetWorkoutCount?: number;
  targetWorkoutDuration?: number;
  targetWeight?: number;
  status: "active" | "completed" | "archived";
}

export interface ProgressMetric {
  id: string;
  userId: string;
  date: Date;
  type: "weight" | "body_fat" | "measurement" | "sleep" | "mood";
  value: number;
  unit: string;
  metadata?: Record<string, any>; // For Sparky-style mapping like sleep mid-points etc.
}

export interface FamilyAccess {
  id: string;
  ownerId: string;
  memberId: string;
  permissions: {
    canViewDiary: boolean;
    canViewReports: boolean;
    canManageGoals: boolean;
  };
  isActive: boolean;
  expiresAt?: Date;
}

export interface AIInsight {
  id: string;
  userId: string;
  type: "recommendation" | "analysis" | "prediction";
  content: string;
  source: "workout" | "nutrition" | "general";
  createdAt: Date;
}
