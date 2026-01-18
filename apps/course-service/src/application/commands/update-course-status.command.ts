export class UpdateCourseStatusCommand {
  constructor(
    public readonly id: string,
    public readonly isActive: boolean,
  ) {}
}