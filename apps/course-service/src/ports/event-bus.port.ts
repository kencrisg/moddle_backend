export abstract class EventBusPort {
  abstract publish(event: any): Promise<void>;
}