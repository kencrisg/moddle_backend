import { Module } from '@nestjs/common';
import { CourseServiceController } from './infrastructure/controllers/course-service.controller';
import { CourseServiceService } from './course-service.service';

@Module({
  imports: [],
  controllers: [CourseServiceController],
  providers: [CourseServiceService],
})
export class CourseServiceModule {}
