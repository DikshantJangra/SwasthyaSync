import { MetricRepository } from "../../domain/repositories/MetricRepository";
import { MetricMapper } from "../mappers/metric.mapper";
import { MetricDTO } from "../dtos/metric.dto";
import { type HealthMetric, type MetricType } from "../../domain/entities/Metric";

// We store metrics as a log (many rows over time).
// For the dashboard we usually want "the latest value per type".
function pickLatestPerType(allRows: HealthMetric[]): HealthMetric[] {
  const latestByType = new Map<MetricType, HealthMetric>();

  for (const row of allRows) {
    const currentLatest = latestByType.get(row.type);

    // First time we see this type
    if (!currentLatest) {
      latestByType.set(row.type, row);
      continue;
    }

    // Decide if this row is newer than what we have
    const rowTime = row.timestamp.getTime();
    const latestTime = currentLatest.timestamp.getTime();

    const isNewerTimestamp = rowTime > latestTime;
    const isSameTimestampButHigherId =
      rowTime === latestTime && (row.id ?? 0) > (currentLatest.id ?? 0);

    if (isNewerTimestamp || isSameTimestampButHigherId) {
      latestByType.set(row.type, row);
    }
  }

  return Array.from(latestByType.values());
}

export class GetMetricsUseCase {
  constructor(private metricRepository: MetricRepository) {}

  async execute(userId: string): Promise<MetricDTO[]> {
    // Returns metrics in the shape the dashboard expects: one (latest) row per type.

    // Step 1: Load all metric rows for this user
    const allMetricRows = await this.metricRepository.findByUserId(userId);

    // Step 2: Keep only the newest row per type
    const latestMetricRows = pickLatestPerType(allMetricRows);

    // Step 3: Convert to DTOs for returning via API
    return MetricMapper.toDTOs(latestMetricRows);
  }
}
