export class CreateCourseCommand {
  constructor(
    public readonly title: string,
    public readonly videoUrl: string,

    public readonly id: string, 
  ) {}
}