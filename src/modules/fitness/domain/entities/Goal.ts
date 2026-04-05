import { Nutrients } from "./Nutrition";

export interface Goal {
  id: string;
  userId: string;
  type: "nutrition" | "workout" | "weight" | "custom";
  goalDate?: Date; // Timeline-specific goal
  targetNutrients?: Nutrients;
  targetValues?: Record<string, any>; // Flexible storage for Sparky features
  status: "active" | "completed" | "archived";
}

export interface ProgressMetric {
  id: string;
  userId: string;
  date: Date;
  type: "weight" | "body_fat" | "measurement" | "sleep" | "mood";
  value: number;
  unit: string;
  metadata?: Record<string, any>;
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
