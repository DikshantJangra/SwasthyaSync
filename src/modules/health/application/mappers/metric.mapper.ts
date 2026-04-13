import { HealthMetric } from "../../domain/entities/Metric";
import { MetricDTO } from "../dtos/metric.dto";

export class MetricMapper {
  // Converts our domain object into something we can safely return over the API.

  static toDTO(entity: HealthMetric): MetricDTO {
    return {
      // Metrics we return come from DB inserts/queries, so `id` should exist.
      id: entity.id!,
      type: entity.type,
      value: entity.value,
      unit: entity.unit || null,
      timestamp: entity.timestamp.toISOString(),
    };
  }

  static toDTOs(entities: HealthMetric[]): MetricDTO[] {
    return entities.map((entity) => MetricMapper.toDTO(entity));
  }
}
