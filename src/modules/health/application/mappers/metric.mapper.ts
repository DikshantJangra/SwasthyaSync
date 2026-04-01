import { HealthMetric } from "../../domain/entities/Metric";
import { MetricDTO } from "../dtos/metric.dto";

export class MetricMapper {
  static toDTO(entity: HealthMetric): MetricDTO {
    return {
      id: entity.id!,
      type: entity.type,
      value: entity.value,
      unit: entity.unit || null,
      timestamp: entity.timestamp.toISOString(),
    };
  }

  static toDTOs(entities: HealthMetric[]): MetricDTO[] {
    return entities.map(this.toDTO);
  }
}
