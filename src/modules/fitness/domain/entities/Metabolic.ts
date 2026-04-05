import { TdeeResult } from "../logic/TdeeCalculator";

export interface DailySummary {
  id: string;
  userId: string;
  date: Date;
  totalCaloriesIn: number;
  totalCaloriesOut: number;
  netCalories: number;
  weightKg?: number;
  steps?: number;
  sleepMinutes?: number;
  waterMl?: number;
  moodScore?: number;
  metadata?: TdeeResult;
}

export interface TdeeLog {
  id: string;
  userId: string;
  date: Date;
  tdee: number;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  isFallback: boolean;
  calculationContext?: any;
}

export interface ExternalProvider {
  id: string;
  userId: string;
  providerType: "garmin" | "fitbit" | "strava" | "polar" | "withings";
  accessToken?: string;
  refreshToken?: string;
  tokenExpiry?: Date;
  lastSync?: Date;
  isActive: boolean;
  config?: any;
}
