import { SimpleGoal } from "../entities/Goal";

export interface GoalRepository {
  saveGoal(goal: SimpleGoal): Promise<void>;
  getUserGoal(userId: string): Promise<SimpleGoal | null>;
}
