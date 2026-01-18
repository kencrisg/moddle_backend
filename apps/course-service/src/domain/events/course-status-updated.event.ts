export class CourseStatusUpdatedEvent {
  constructor(
    public readonly id: string,
    public readonly isActive: boolean,
  ) {}
}