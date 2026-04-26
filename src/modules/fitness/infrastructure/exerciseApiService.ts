export interface ExerciseSearchResult {
  exerciseName: string;
  caloriesPerSet: number; // approximate calories burned per set
}

const EXERCISE_DATABASE: ExerciseSearchResult[] = [
  { exerciseName: "Bench Press", caloriesPerSet: 15 },
  { exerciseName: "Squat", caloriesPerSet: 20 },
  { exerciseName: "Deadlift", caloriesPerSet: 25 },
  { exerciseName: "Pull Up", caloriesPerSet: 12 },
  { exerciseName: "Pushup", caloriesPerSet: 8 },
  { exerciseName: "Overhead Press", caloriesPerSet: 10 },
  { exerciseName: "Barbell Row", caloriesPerSet: 12 },
  { exerciseName: "Bicep Curl", caloriesPerSet: 5 },
  { exerciseName: "Tricep Extension", caloriesPerSet: 5 },
  { exerciseName: "Leg Press", caloriesPerSet: 18 },
  { exerciseName: "Lunges", caloriesPerSet: 15 },
  { exerciseName: "Plank", caloriesPerSet: 10 }, // treated as 1 minute set
  { exerciseName: "Crunches", caloriesPerSet: 6 },
  { exerciseName: "Running (Treadmill)", caloriesPerSet: 30 }, // treated as a small block
  { exerciseName: "Cycling (Stationary)", caloriesPerSet: 25 },
];

export async function searchExercise(query: string): Promise<ExerciseSearchResult[]> {
  // Simulate network delay for realism
  await new Promise(resolve => setTimeout(resolve, 300));

  const lowercaseQuery = query.toLowerCase().trim();
  if (!lowercaseQuery) return [];

  return EXERCISE_DATABASE.filter(ex => 
    ex.exerciseName.toLowerCase().includes(lowercaseQuery)
  ).slice(0, 10);
}
