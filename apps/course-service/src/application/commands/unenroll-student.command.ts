export class UnenrollStudentCommand {
    constructor(public readonly studentId: string, public readonly courseId: string) { }
}