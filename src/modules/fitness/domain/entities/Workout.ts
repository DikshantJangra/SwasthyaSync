export interface Exercise {
  id: string;
  name: string;
  description?: string;
  category: string;
  targetMuscles?: string[];
  equipment?: string[];
  mechanic?: "compound" | "isolation";
  force?: "push" | "pull" | "static";
  level?: "beginner" | "intermediate" | "expert";
}

export interface Workout {
  id: string;
  userId: string;
  name: string;
  description?: string;
  exerciseIds: string[];
  createdAt: Date;
}

export interface ExerciseSet {
  exerciseId: string;
  setNumber: number;
  setType: "warmup" | "working" | "dropset" | "failure";
  reps?: number;
  weight?: number;
  durationSeconds?: number;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  restTimeSeconds?: number;
}

export interface WorkoutLog {
  id: string;
  userId: string;
  workoutId?: string;
  date: Date;
  durationMinutes: number;
  caloriesBurned?: number;
  avgHeartRate?: number;
  steps?: number;
  sets: ExerciseSet[];
  notes?: string;
}
