import { MetricRepository } from "../../domain/repositories/MetricRepository";

export class GetTodayHydrationUseCase {
  constructor(private metricRepository: MetricRepository) {}

  async execute(userId: string): Promise<{ totalHydration: number }> {
    const allMetrics = await this.metricRepository.findByUserId(userId);
    
    // Get today's date bounds
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const endOfDay = startOfDay + 24 * 60 * 60 * 1000;

    // Filter by type "hydration" and today's date, then sum the values
    const totalHydration = allMetrics
      .filter(m => m.type === "hydration" && m.timestamp.getTime() >= startOfDay && m.timestamp.getTime() < endOfDay)
      .reduce((sum, m) => sum + Number(m.value), 0);

    return { totalHydration };
  }
}
