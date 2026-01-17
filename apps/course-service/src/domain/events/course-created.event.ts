export class CourseCreatedEvent {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly videoUrl: string,
    public readonly createdAt: Date,
  ) {}

  // Método para convertir el evento a String (para Kafka)
  toString() {
    return JSON.stringify({
      id: this.id,
      title: this.title,
      videoUrl: this.videoUrl,
      createdAt: this.createdAt,
    });
  }
}