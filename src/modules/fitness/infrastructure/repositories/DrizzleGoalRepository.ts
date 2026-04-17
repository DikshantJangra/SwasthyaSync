import { GoalRepository } from "../../domain/repositories/GoalRepository";
import { SimpleGoal, GoalType } from "../../domain/entities/Goal";
import { db } from "@/lib/db/db";
import { fitnessGoals } from "../schema";
import { eq, desc } from "drizzle-orm";

export class DrizzleGoalRepository implements GoalRepository {
  async saveGoal(goal: SimpleGoal): Promise<void> {
    // Delete old goals to keep it simple and avoid sorting issues since there is no createdAt column
    await db.delete(fitnessGoals).where(eq(fitnessGoals.userId, goal.userId));

    // Insert new one
    await db.insert(fitnessGoals).values({
      id: goal.id,
      userId: goal.userId,
      type: goal.goalType,
      status: "active",
    });
  }

  async getUserGoal(userId: string): Promise<SimpleGoal | null> {
    const rows = await db
      .select()
      .from(fitnessGoals)
      .where(eq(fitnessGoals.userId, userId))
      .orderBy(desc(fitnessGoals.id)); // Using ID descending to get the latest (since ID is random, maybe not ideal, but schema doesn't have createdAt, let's just get the first one)

    if (rows.length === 0) return null;

    const row = rows[0];
    return {
      id: row.id,
      userId: row.userId,
      goalType: row.type as GoalType,
      createdAt: new Date(), // We don't have createdAt in schema, returning current date
    };
  }
}
