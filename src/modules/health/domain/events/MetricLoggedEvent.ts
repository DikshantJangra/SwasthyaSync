import { DomainEvent } from "@/lib/events/EventBus";
import { HealthMetric } from "../entities/Metric";

export class MetricLoggedEvent implements DomainEvent {
  public name = 'health.metric_logged';
  public timestamp = new Date();

  constructor(public payload: { metric: HealthMetric }) {}
}
