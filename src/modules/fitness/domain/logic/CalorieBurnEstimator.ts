export interface ExerciseSession {
  category: string;
  level: string;
  durationMinutes: number;
  sets?: { reps: number; weight: number }[];
}

export interface UserStats {
  weightKg: number;
  age: number;
  gender: "male" | "female" | "other";
}

const MET_VALUES: Record<string, Record<string, number>> = {
  cardio: { beginner: 6.0, intermediate: 7.0, expert: 8.0 },
  strength: { beginner: 4.0, intermediate: 5.0, expert: 6.0 },
  plyometrics: { beginner: 6.0, intermediate: 7.0, expert: 8.0 },
  stretching: { beginner: 2.0, intermediate: 2.5, expert: 3.0 },
  default: { beginner: 3.0, intermediate: 3.5, expert: 4.0 },
};

export class CalorieBurnEstimator {
  /**
   * Estimates calories burned for an exercise session.
   * Formula: (MET * 3.5 * weightKg / 200) * durationMinutes
   */
  static estimate(session: ExerciseSession, user: UserStats): number {
    const category = session.category.toLowerCase();
    const level = session.level.toLowerCase() || "intermediate";
    
    let met = MET_VALUES[category]?.[level] || MET_VALUES.default[level];

    // Strength specific intensity adjustment
    if (category === "strength" && session.sets && session.sets.length > 0) {
      const totalVolume = session.sets.reduce((acc, set) => acc + (set.reps * set.weight), 0);
      const totalReps = session.sets.reduce((acc, set) => acc + set.reps, 0);
      
      if (totalReps > 0) {
        const avgWeight = totalVolume / totalReps;
        // Brzycki 1RM Estimation
        const estimated1RM = avgWeight / (1.0278 - 0.0278 * totalReps);
        const intensity = avgWeight / estimated1RM;
        
        if (intensity < 0.4) met = 2.5;
        else if (intensity < 0.6) met = 3.5;
        else if (intensity < 0.8) met = 4.5;
        else met = 5.5;
      }
    }

    let caloriesPerMinute = (met * 3.5 * user.weightKg) / 200;

    // Gender adjustment
    if (user.gender === "female") {
      caloriesPerMinute *= 0.9;
    }

    // Age adjustment (0.5% reduction every 5 years over 30)
    if (user.age > 30) {
      const ageAdjustment = 1 - Math.floor((user.age - 30) / 5) * 0.005;
      caloriesPerMinute *= Math.max(0.85, ageAdjustment);
    }

    return Math.round(caloriesPerMinute * session.durationMinutes);
  }

  static calculate1RM(weight: number, reps: number): number {
    if (reps === 1) return weight;
    // Brzycki Formula
    return weight / (1.0278 - 0.0278 * reps);
  }
}
