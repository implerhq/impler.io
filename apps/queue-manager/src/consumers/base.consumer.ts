export abstract class BaseConsumer {
  abstract message(data: any): void;
}
