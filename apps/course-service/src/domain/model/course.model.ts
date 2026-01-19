export class Course {
    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly videoUrl: string,
        public readonly isActive: boolean,
        public readonly createdAt: Date,
    ) {}

    static create(id: string, title: string, videoUrl: string): Course {
        return new Course(id, title, videoUrl, true, new Date());
    }
}