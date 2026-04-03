export interface Nutrients {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  saturatedFat?: number;
  transFat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  potassium?: number;
  cholesterol?: number;
  vitaminA?: number;
  vitaminC?: number;
  calcium?: number;
  iron?: number;
}

export interface Food {
  id: string;
  name: string;
  brand?: string;
  nutrients: Nutrients;
  servingSize: number;
  servingUnit: string;
}

export interface Meal {
  id: string;
  userId: string;
  name: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  items: {
    foodId: string;
    quantity: number;
    unit: string;
  }[];
  createdAt: Date;
}

export interface NutritionLogEntry {
  id: string;
  userId: string;
  date: Date;
  mealType: string;
  foodId?: string;
  mealId?: string;
  foodName?: string;
  quantity: number;
  unit: string;
  nutrients: Nutrients; // Snapshotted nutrients at time of entry
}

export interface DailyNutritionSummary {
  userId: string;
  date: Date;
  totalNutrients: Nutrients;
  goalNutrients?: Nutrients;
}
