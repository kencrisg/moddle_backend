import { IsNotEmpty, IsUUID } from 'class-validator';

export class EnrollStudentDto {
  @IsUUID('4')
  @IsNotEmpty()
  studentId: string;

  @IsUUID('4')
  @IsNotEmpty()
  courseId: string;
}