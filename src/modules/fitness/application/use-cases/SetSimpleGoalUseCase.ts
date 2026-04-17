import { GoalRepository } from "../../domain/repositories/GoalRepository";
import { SimpleGoal, GoalType } from "../../domain/entities/Goal";

export class SetSimpleGoalUseCase {
  constructor(private goalRepo: GoalRepository) {}

  async execute(userId: string, goalType: GoalType): Promise<void> {
    const goal: SimpleGoal = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      goalType,
      createdAt: new Date(),
    };
    
    await this.goalRepo.saveGoal(goal);
  }
}
