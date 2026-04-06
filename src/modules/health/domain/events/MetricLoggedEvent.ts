import { DomainEvent } from "@/lib/events/EventBus";
import { HealthMetric } from "../entities/Metric";

export class MetricLoggedEvent implements DomainEvent {
  // Other parts of the app can subscribe to this.
  public name = 'health.metric_logged';

  // When the event was created
  public timestamp = new Date();

  // The metric we just saved
  constructor(public payload: { metric: HealthMetric }) {}
}
