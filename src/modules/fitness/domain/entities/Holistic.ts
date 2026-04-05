export interface SleepLog {
  id: string;
  userId: string;
  date: Date; // Wake up date
  bedTime?: Date;
  wakeTime?: Date;
  totalDurationMinutes?: number;
  qualityScore?: number; // 0-100
  stages?: {
    rem: number;
    light: number;
    deep: number;
    awake: number;
  };
  latencyMinutes?: number;
}

export interface FastingLog {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  targetDurationHours?: number;
  isCompleted: boolean;
}

export interface WaterContainer {
  id: string;
  userId: string;
  name: string;
  volumeMl: number;
  isDefault: boolean;
}

export interface WaterIntake {
  id: string;
  userId: string;
  date: Date;
  amountMl: number;
  containerId?: string;
}
