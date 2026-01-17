import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnrollmentEntity } from '../../infrastructure/persistence/entities/enrollment.entity';
import { EnrollStudentCommand } from '../commands/enroll-student.command';

@CommandHandler(EnrollStudentCommand)
export class EnrollStudentHandler implements ICommandHandler<EnrollStudentCommand> {
  constructor(
    @InjectRepository(EnrollmentEntity)
    private readonly enrollmentRepo: Repository<EnrollmentEntity>,
  ) {}

  async execute(command: EnrollStudentCommand): Promise<void> {
    const { studentId, courseId } = command;
    const enrollment = new EnrollmentEntity();
    enrollment.id = crypto.randomUUID();
    enrollment.studentId = studentId;
    enrollment.courseId = courseId;

    await this.enrollmentRepo.save(enrollment);
    console.log(`💾 [Enroll] Matrícula guardada con éxito`);
  }
}