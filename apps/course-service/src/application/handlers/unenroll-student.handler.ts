import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnrollmentEntity } from '../../infrastructure/persistence/entities/enrollment.entity';
import { UnenrollStudentCommand } from '../commands/unenroll-student.command';

@CommandHandler(UnenrollStudentCommand)
export class UnenrollStudentHandler implements ICommandHandler<UnenrollStudentCommand> {
  constructor(
    @InjectRepository(EnrollmentEntity)
    private readonly enrollmentRepo: Repository<EnrollmentEntity>,
  ) {}

  async execute(command: UnenrollStudentCommand): Promise<void> {
    const { studentId, courseId } = command;
    await this.enrollmentRepo.delete({ studentId, courseId });
    console.log(`🗑️ [Unenroll] Estudiante ${studentId} eliminado del curso ${courseId}`);
  }
}